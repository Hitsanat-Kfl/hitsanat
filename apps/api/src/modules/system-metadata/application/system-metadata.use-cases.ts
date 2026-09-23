import type {
  SystemMetadataRepository,
  SystemMetadataRow,
} from "../infrastructure/system-metadata.repository.js";

export class ListSystemMetadataUseCase {
  constructor(private readonly repository: SystemMetadataRepository) {}

  async execute(): Promise<SystemMetadataRow[]> {
    return this.repository.list();
  }
}

/**
 * Seed the panel's known keys from the migration journal tag when the
 * table is empty (idempotent — only writes if key is missing).
 */
export class EnsureSystemMetadataDefaultsUseCase {
  constructor(private readonly repository: SystemMetadataRepository) {}

  async execute(defaults: Record<string, string>): Promise<SystemMetadataRow[]> {
    for (const [key, value] of Object.entries(defaults)) {
      const existing = await this.repository.findByKey(key);
      if (!existing) {
        await this.repository.upsert(key, value);
      }
    }
    return this.repository.list();
  }
}
