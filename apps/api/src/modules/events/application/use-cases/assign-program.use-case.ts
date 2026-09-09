import type { EventProgramAssignment } from "@repo/domain";
import type { EventsRepository } from "../../domain/repositories/events.repository.js";

const MIN_MEMBERS_PER_PROGRAM = 2;

interface AssignProgramInput {
  eventId: string;
  subDepartmentId: string;
  programTitle: string;
  assignedMembers: string[];
}

export class AssignProgramUseCase {
  constructor(private readonly repo: EventsRepository) {}

  async execute(input: AssignProgramInput): Promise<EventProgramAssignment> {
    const event = await this.repo.findEventById(input.eventId);
    if (!event) {
      throw new Error(`Event not found: ${input.eventId}`);
    }

    if (input.assignedMembers.length < MIN_MEMBERS_PER_PROGRAM) {
      throw new Error(
        `Program "${input.programTitle}" has ${input.assignedMembers.length} members. Minimum ${MIN_MEMBERS_PER_PROGRAM} required per program (BR-014).`
      );
    }

    return this.repo.createProgramAssignment({
      eventId: input.eventId,
      subDepartmentId: input.subDepartmentId,
      programTitle: input.programTitle,
      assignedMembers: JSON.stringify(input.assignedMembers),
    });
  }
}
