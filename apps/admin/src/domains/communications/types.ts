export interface PublicStats {
  activeMembers: number;
  enrolledChildren: number;
  completedEvents: number;
}

export interface PublicEvent {
  id: string;
  title: string;
  eventDate: string;
  venue: string;
  description: string;
}

export interface PublicAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdBy: string;
  createdAt: string;
}
