import type { Event, EventProgramAssignment } from "@repo/domain";

export interface EventsRepository {
  findEventById(id: string): Promise<(Event & { programs: EventProgramAssignment[] }) | null>;
  findManyEvents(params: { page?: number; limit?: number; eventType?: string }): Promise<{
    success: boolean;
    data: Event[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
  createEvent(data: {
    eventName: string;
    eventType: string;
    eventDate: Date;
    isPublished: boolean;
    countdownActive: boolean;
  }): Promise<Event>;
  updateEvent(
    id: string,
    data: Partial<{
      eventName: string;
      eventType: string;
      eventDate: Date;
      isPublished: boolean;
      countdownActive: boolean;
    }>
  ): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  createProgramAssignment(data: {
    eventId: string;
    subDepartmentId: string;
    programTitle: string;
    assignedMembers: string;
  }): Promise<EventProgramAssignment>;
  findProgramAssignmentsByEventId(eventId: string): Promise<EventProgramAssignment[]>;
}
