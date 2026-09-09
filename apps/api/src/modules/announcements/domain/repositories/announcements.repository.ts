import type { Announcement } from "@repo/domain";

export interface AnnouncementsRepository {
  findAnnouncementById(id: string): Promise<Announcement | null>;
  findManyAnnouncements(params: {
    page?: number;
    limit?: number;
    targetAudience?: string;
    isPublished?: boolean;
  }): Promise<{
    success: boolean;
    data: Announcement[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
  createAnnouncement(data: {
    title: string;
    content: string;
    targetAudience: string;
    createdBy: string;
  }): Promise<Announcement>;
  updateAnnouncement(
    id: string,
    data: Partial<{
      title: string;
      content: string;
      targetAudience: string;
    }>
  ): Promise<Announcement>;
  publishAnnouncement(id: string): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<void>;
}
