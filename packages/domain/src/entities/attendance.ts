import type { BaseEntity } from "../base.js";

export enum SessionType {
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
}

export enum AttendanceStatus {
  EXPECTED = "Expected",
  PRESENT = "Present",
  ABSENT = "Absent",
  EXCUSED = "Excused",
}

export enum PersonType {
  MEMBER = "Member",
  CHILD = "Child",
}

export interface ProgramSession extends BaseEntity {
  sessionType: SessionType;
  sessionDate: Date;
  startTime: Date;
  endTime: Date;
}

export interface ProgramSessionAttendance extends BaseEntity {
  programSessionId: string;
  personType: PersonType;
  personId: string;
  collectionLocation?: string;
  status: AttendanceStatus;
  recordedBy: string;
  confirmedAt?: Date;
}

export interface Event extends BaseEntity {
  eventName: string;
  eventType: EventType;
  eventDate: Date;
  isPublished: boolean;
  countdownActive: boolean;
}

export enum EventType {
  SPECIAL = "Special",
  EXTRA_TRAINING = "Extra_Training",
  AWDEMERIT = "Awdemerit",
  ADAR = "Adar",
}

export interface EventProgramAssignment extends BaseEntity {
  eventId: string;
  subDepartmentId: string;
  programTitle: string;
  assignedMembers: string[];
}

export interface EventAttendance extends BaseEntity {
  eventId: string;
  personType: PersonType;
  personId: string;
  status: AttendanceStatus;
  recordedBy: string;
  confirmedAt?: Date;
}

export type CreateProgramSession = Omit<ProgramSession, "id" | "createdAt" | "updatedAt">;
export type CreateEvent = Omit<Event, "id" | "createdAt" | "updatedAt">;
