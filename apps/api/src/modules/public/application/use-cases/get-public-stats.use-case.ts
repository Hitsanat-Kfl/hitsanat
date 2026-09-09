import type { PublicStats } from "../../domain/repositories/public.repository.js";
import type { PublicRepository } from "../../domain/repositories/public.repository.js";

export class GetPublicStatsUseCase {
  constructor(private readonly repo: PublicRepository) {}

  async execute(): Promise<PublicStats> {
    return this.repo.getPublicStats();
  }
}
