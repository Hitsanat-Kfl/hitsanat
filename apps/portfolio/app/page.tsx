import { formatEthiopianDate, toEthiopianDate } from "@repo/calendar";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Stats } from "../components/stats";
import { Programs } from "../components/programs";
import { About } from "../components/about";
import { Events } from "../components/events";
import { Announcements } from "../components/announcements";
import { Footer } from "../components/footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchPublicStats() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/stats`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

async function fetchPublicEvents() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/events`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

async function fetchPublicAnnouncements() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/announcements`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const [stats, events, announcements] = await Promise.all([
    fetchPublicStats(),
    fetchPublicEvents(),
    fetchPublicAnnouncements(),
  ]);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Stats stats={stats} />
      <Programs />
      <Events events={events} />
      <Announcements announcements={announcements} />
      <About />
      <Footer />
    </main>
  );
}
