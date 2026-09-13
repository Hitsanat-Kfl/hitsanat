import "dotenv/config";
import { and, eq, getDb } from "@repo/database";
import { announcements } from "@repo/database/schema";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const POLL_INTERVAL_MS = Number(process.env.TELEGRAM_POLL_INTERVAL_MS) || 30_000;

const sentAnnouncementIds = new Set<string>();

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

function formatAnnouncementMessage(announcement: {
  id: string;
  title: string;
  content: string;
  targetAudience: string;
}): string {
  const lines = [
    `*${escapeMarkdown(announcement.title)}*`,
    "",
    escapeMarkdown(announcement.content),
    "",
    `👥 ${escapeMarkdown(announcement.targetAudience)}`,
    "",
    "— Hitsanat Kifl 🇪🇹",
  ];
  return lines.join("\n");
}

async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("[Telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Telegram] API error ${response.status}: ${errorText}`);
      return false;
    }

    console.log("[Telegram] Message sent successfully");
    return true;
  } catch (error) {
    console.error("[Telegram] Connection error:", error instanceof Error ? error.message : error);
    return false;
  }
}

async function pollAnnouncements(): Promise<void> {
  try {
    const db = getDb();
    const unpublished = await db
      .select()
      .from(announcements)
      .where(and(eq(announcements.publishToTelegram, true), eq(announcements.isPublished, true)));

    for (const announcement of unpublished) {
      if (sentAnnouncementIds.has(announcement.id)) {
        continue;
      }

      const message = formatAnnouncementMessage({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        targetAudience: announcement.targetAudience,
      });

      const success = await sendTelegramMessage(message);
      if (success) {
        sentAnnouncementIds.add(announcement.id);
        console.log(`[Telegram] Sent announcement: ${announcement.title}`);
      }
    }
  } catch (error) {
    console.error("[Telegram] Poll error:", error instanceof Error ? error.message : error);
  }
}

function main(): void {
  console.log("[Telegram] Starting Hitsanat Kifl Telegram Bot Worker");
  console.log(`[Telegram] Poll interval: ${POLL_INTERVAL_MS}ms`);

  if (!TELEGRAM_BOT_TOKEN) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN not set — bot will not send messages");
  }
  if (!TELEGRAM_CHAT_ID) {
    console.warn("[Telegram] TELEGRAM_CHAT_ID not set — bot will not send messages");
  }

  pollAnnouncements();
  setInterval(pollAnnouncements, POLL_INTERVAL_MS);
}

main();
