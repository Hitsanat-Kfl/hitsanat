"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { PeriodicReport, PublicAnnouncement, PublicEvent, PublicStats } from "@/lib/types";

interface DashboardData {
  stats: PublicStats | null;
  recentEvents: PublicEvent[];
  recentAnnouncements: PublicAnnouncement[];
  recentReports: PeriodicReport[];
  loading: boolean;
  error: string | null;
}

export function useDashboard(): DashboardData & { refresh: () => void } {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<PublicEvent[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [recentReports, setRecentReports] = useState<PeriodicReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, eventsRes, announcementsRes, reportsRes] = await Promise.allSettled([
        api.get<{ success: boolean; data: PublicStats }>("/public/stats"),
        api.get<{ success: boolean; data: PublicEvent[] }>("/public/events"),
        api.get<{ success: boolean; data: PublicAnnouncement[] }>("/public/announcements"),
        api.get<{ success: boolean; data: PeriodicReport[] }>("/reports?limit=5"),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (eventsRes.status === "fulfilled") setRecentEvents(eventsRes.value.data.slice(0, 5));
      if (announcementsRes.status === "fulfilled")
        setRecentAnnouncements(announcementsRes.value.data.slice(0, 5));
      if (reportsRes.status === "fulfilled") setRecentReports(reportsRes.value.data.slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    stats,
    recentEvents,
    recentAnnouncements,
    recentReports,
    loading,
    error,
    refresh: fetchDashboard,
  };
}
