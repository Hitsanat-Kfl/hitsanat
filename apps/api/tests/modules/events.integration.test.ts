import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssignProgramUseCase } from "../../src/modules/events/application/use-cases/assign-program.use-case.js";
import { CreateEventUseCase } from "../../src/modules/events/application/use-cases/create-event.use-case.js";
import { GetEventUseCase } from "../../src/modules/events/application/use-cases/get-event.use-case.js";
import { ListEventAttendanceUseCase } from "../../src/modules/events/application/use-cases/list-event-attendance.use-case.js";
import { ListEventsUseCase } from "../../src/modules/events/application/use-cases/list-events.use-case.js";
import { RecordEventAttendanceUseCase } from "../../src/modules/events/application/use-cases/record-event-attendance.use-case.js";
import { UpdateEventAttendanceUseCase } from "../../src/modules/events/application/use-cases/update-event-attendance.use-case.js";
import type { EventsRepository } from "../../src/modules/events/domain/repositories/events.repository.js";

const mockEvent = {
  id: "event-001",
  eventName: "Timket Celebration",
  eventType: "Special" as const,
  eventDate: new Date("2027-01-19"),
  isPublished: true,
  countdownActive: true,
  createdAt: new Date("2026-09-01"),
};

const mockProgram = {
  id: "program-001",
  eventId: "event-001",
  subDepartmentId: "MEZMUR",
  programTitle: "Choir Performance",
  assignedMembers: JSON.stringify(["member-001", "member-002"]),
  createdAt: new Date("2026-09-01"),
};

const mockAttendance = {
  id: "attendance-001",
  eventId: "event-001",
  personType: "Member" as const,
  personId: "member-001",
  status: "Present" as const,
  recordedBy: "leader-001",
  confirmedAt: new Date("2027-01-19"),
  createdAt: new Date("2027-01-19"),
};

function createMockEventsRepo(): EventsRepository {
  return {
    findEventById: vi.fn(),
    findManyEvents: vi.fn(),
    createEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
    createProgramAssignment: vi.fn(),
    findProgramAssignmentsByEventId: vi.fn(),
    createEventAttendance: vi.fn(),
    findEventAttendanceById: vi.fn(),
    findEventAttendanceByEventId: vi.fn(),
    updateEventAttendance: vi.fn(),
  };
}

describe("Events Integration Tests", () => {
  let repo: EventsRepository;

  beforeEach(() => {
    repo = createMockEventsRepo();
  });

  describe("Event CRUD (FR-09.1)", () => {
    it("should create an event with valid data", async () => {
      const useCase = new CreateEventUseCase(repo);

      vi.mocked(repo.createEvent).mockResolvedValue(mockEvent);

      const result = await useCase.execute({
        eventName: "Timket Celebration",
        eventType: "Special",
        eventDate: new Date("2027-01-19"),
        isPublished: true,
        countdownActive: true,
      });

      expect(result).toBeDefined();
      expect(result.eventName).toBe("Timket Celebration");
      expect(result.eventType).toBe("Special");
      expect(repo.createEvent).toHaveBeenCalledOnce();
    });

    it("should list events with pagination", async () => {
      const useCase = new ListEventsUseCase(repo);

      vi.mocked(repo.findManyEvents).mockResolvedValue({
        success: true,
        data: [mockEvent],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await useCase.execute({ page: 1, limit: 20 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it("should get event by ID with programs", async () => {
      const useCase = new GetEventUseCase(repo);

      vi.mocked(repo.findEventById).mockResolvedValue({
        ...mockEvent,
        programs: [mockProgram],
      });

      const result = await useCase.execute("event-001");

      expect(result.programs).toHaveLength(1);
      expect(result.programs[0].programTitle).toBe("Choir Performance");
    });

    it("should throw for non-existent event", async () => {
      const useCase = new GetEventUseCase(repo);

      vi.mocked(repo.findEventById).mockResolvedValue(null);

      await expect(useCase.execute("non-existent")).rejects.toThrow(
        "Event not found: non-existent"
      );
    });
  });

  describe("Program Assignment (FR-09.2, BR-014)", () => {
    it("should assign program to event", async () => {
      const useCase = new AssignProgramUseCase(repo);

      vi.mocked(repo.findEventById).mockResolvedValue({
        ...mockEvent,
        programs: [],
      });
      vi.mocked(repo.createProgramAssignment).mockResolvedValue(mockProgram);

      const result = await useCase.execute({
        eventId: "event-001",
        subDepartmentId: "MEZMUR",
        programTitle: "Choir Performance",
        assignedMembers: ["member-001", "member-002"],
      });

      expect(result).toBeDefined();
      expect(result.programTitle).toBe("Choir Performance");
      expect(repo.createProgramAssignment).toHaveBeenCalledOnce();
    });

    it("should reject assignment to non-existent event", async () => {
      const useCase = new AssignProgramUseCase(repo);

      vi.mocked(repo.findEventById).mockResolvedValue(null);

      await expect(
        useCase.execute({
          eventId: "non-existent",
          subDepartmentId: "MEZMUR",
          programTitle: "Choir Performance",
          assignedMembers: ["member-001"],
        })
      ).rejects.toThrow("Event not found: non-existent");
    });
  });

  describe("Event Attendance (BES-016)", () => {
    it("should record event attendance", async () => {
      const useCase = new RecordEventAttendanceUseCase(repo);

      vi.mocked(repo.findEventById).mockResolvedValue({
        ...mockEvent,
        programs: [],
      });
      vi.mocked(repo.createEventAttendance).mockResolvedValue(mockAttendance);

      const result = await useCase.execute({
        eventId: "event-001",
        personType: "Member",
        personId: "member-001",
        status: "Present",
        recordedBy: "leader-001",
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("Present");
      expect(repo.createEventAttendance).toHaveBeenCalledOnce();
    });

    it("should reject attendance for non-existent event", async () => {
      const useCase = new RecordEventAttendanceUseCase(repo);

      vi.mocked(repo.findEventById).mockResolvedValue(null);

      await expect(
        useCase.execute({
          eventId: "non-existent",
          personType: "Member",
          personId: "member-001",
          status: "Present",
          recordedBy: "leader-001",
        })
      ).rejects.toThrow("Event not found: non-existent");
    });

    it("should list event attendance", async () => {
      const useCase = new ListEventAttendanceUseCase(repo);

      vi.mocked(repo.findEventAttendanceByEventId).mockResolvedValue([mockAttendance]);

      const result = await useCase.execute("event-001");

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("Present");
    });

    it("should update event attendance", async () => {
      const useCase = new UpdateEventAttendanceUseCase(repo);

      vi.mocked(repo.findEventAttendanceById).mockResolvedValue(mockAttendance);
      vi.mocked(repo.updateEventAttendance).mockResolvedValue({
        ...mockAttendance,
        status: "Confirmed",
      });

      const result = await useCase.execute({
        id: "attendance-001",
        status: "Confirmed",
      });

      expect(result.status).toBe("Confirmed");
      expect(repo.updateEventAttendance).toHaveBeenCalledWith("attendance-001", {
        status: "Confirmed",
        confirmedAt: undefined,
      });
    });

    it("should reject update for non-existent attendance", async () => {
      const useCase = new UpdateEventAttendanceUseCase(repo);

      vi.mocked(repo.findEventAttendanceById).mockResolvedValue(null);

      await expect(useCase.execute({ id: "non-existent", status: "Confirmed" })).rejects.toThrow(
        "Event attendance not found: non-existent"
      );
    });
  });
});
