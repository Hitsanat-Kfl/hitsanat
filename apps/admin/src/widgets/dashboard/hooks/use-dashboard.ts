"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type {
  PeriodicReport,
  PublicAnnouncement,
  PublicEvent,
  PublicStats,
} from "@/domains/definitions";

interface DashboardData {
  stats: PublicStats | null;
  recentEvents: PublicEvent[];
  recentAnnouncements: PublicAnnouncement[];
  recentReports: PeriodicReport[];
  loading: boolean;
  error: string | null;
}

export function useDashboard(): DashboardData & { refresh: () => void } {
  const query = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const [statsRes, eventsRes, announcementsRes, reportsRes] = await Promise.allSettled([
        api.get<{ success: boolean; data: PublicStats }>("/public/stats"),
        api.get<{ success: boolean; data: PublicEvent[] }>("/public/events"),
        api.get<{ success: boolean; data: PublicAnnouncement[] }>("/public/announcements"),
        api.get<{ success: boolean; data: PeriodicReport[] }>("/reports?limit=5"),
      ]);

      // Core stats is required for a truthful dashboard.
      if (statsRes.status === "rejected") {
        throw statsRes.reason;
      }

      return {
        stats: statsRes.value.data,
        recentEvents: eventsRes.status === "fulfilled" ? eventsRes.value.data.slice(0, 5) : [],
        recentAnnouncements:
          announcementsRes.status === "fulfilled" ? announcementsRes.value.data.slice(0, 5) : [],
        recentReports: reportsRes.status === "fulfilled" ? reportsRes.value.data.slice(0, 5) : [],
      };
    },
  });

  return {
    stats: query.data?.stats ?? null,
    recentEvents: query.data?.recentEvents ?? [],
    recentAnnouncements: query.data?.recentAnnouncements ?? [],
    recentReports: query.data?.recentReports ?? [],
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to load dashboard") : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
