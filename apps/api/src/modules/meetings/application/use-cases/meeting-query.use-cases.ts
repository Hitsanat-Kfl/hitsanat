import type { MeetingsRepository } from "../../domain/repositories/meetings.repository.js";

export class ListMeetingsUseCase {
  constructor(private readonly repo: MeetingsRepository) {}

  async execute(params: { page?: number; limit?: number; status?: string; upcoming?: boolean }) {
    return this.repo.findManyMeetings({
      page: params.page,
      limit: params.limit,
      status: params.status,
      upcomingOnly: params.upcoming === true,
    });
  }
}

export class GetMeetingUseCase {
  constructor(private readonly repo: MeetingsRepository) {}

  async execute(id: string) {
    const meeting = await this.repo.findMeetingById(id);
    if (!meeting) {
      throw new Error(`Meeting not found: ${id}`);
    }
    const invitees = await this.repo.findInviteesByMeetingId(id);
    return { ...meeting, invitees };
  }
}
