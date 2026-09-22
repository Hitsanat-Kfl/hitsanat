-- Migration 0009: In-app notifications (endpoints.md §2.24)
-- Backs FR-17.1 (plan approval notifications) and FR-13.1.2 (meeting
-- reminders). Telegram delivery remains with the standalone bot service
-- (ADR-0006); this table powers the in-app feed and unread badges.

CREATE TABLE IF NOT EXISTS "notifications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "type" varchar(48) NOT NULL,
  "title" varchar(255) NOT NULL,
  "body" text,
  "resource_type" varchar(32),
  "resource_id" uuid,
  "link" text,
  "read_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications" ("user_id");
CREATE INDEX IF NOT EXISTS "notifications_user_read_idx" ON "notifications" ("user_id", "read_at");
