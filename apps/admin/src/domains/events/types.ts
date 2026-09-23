export type EventType = "Special" | "Extra_Training" | "Awdemerit" | "Adar";

export interface Event {
  id: string;
  eventName: string;
  eventType: EventType;
  eventDate: string;
  isPublished: boolean;
  countdownActive: boolean;
  createdAt: string;
}

export interface EventAssignment {
  id: string;
  eventId: string;
  subDepartmentId: string;
  programTitle: string;
  assignedMembers: string[];
}

export interface EventFilters {
  page?: number;
  limit?: number;
  eventType?: EventType;
}
