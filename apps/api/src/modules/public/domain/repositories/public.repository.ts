import type { Announcement, Event } from "@repo/domain";

export interface PublicStats {
  activeMembers: number;
  enrolledChildren: number;
  completedEvents: number;
}

export interface PublicRepository {
  getPublicStats(): Promise<PublicStats>;
  getPublishedEvents(): Promise<Event[]>;
  getPublishedAnnouncements(): Promise<Announcement[]>;
}
