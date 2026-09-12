import type { Event, EventAttendance, EventProgramAssignment } from "@repo/domain";

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

  // Event Attendance (BES-016)
  createEventAttendance(data: {
    eventId: string;
    personType: string;
    personId: string;
    status: string;
    recordedBy: string;
  }): Promise<EventAttendance>;
  findEventAttendanceById(id: string): Promise<EventAttendance | null>;
  findEventAttendanceByEventId(eventId: string): Promise<EventAttendance[]>;
  updateEventAttendance(
    id: string,
    data: Partial<{ status: string; confirmedAt: Date }>
  ): Promise<EventAttendance>;
}
