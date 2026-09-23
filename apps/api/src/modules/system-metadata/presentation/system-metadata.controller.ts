import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response } from "express";
import {
  EnsureSystemMetadataDefaultsUseCase,
  ListSystemMetadataUseCase,
} from "../application/system-metadata.use-cases.js";
import { DrizzleSystemMetadataRepository } from "../infrastructure/system-metadata.repository.js";

const repository = new DrizzleSystemMetadataRepository();

/**
 * FR-13.4: seed / migration status for the Super Admin dashboard.
 * Values are optional text key/value pairs (e.g. schema_tag, seed_status).
 */
export async function listSystemMetadata(_req: Request, res: Response) {
  try {
    const ensure = new EnsureSystemMetadataDefaultsUseCase(repository);
    const list = new ListSystemMetadataUseCase(repository);
    await ensure.execute({
      schema_tag: readSchemaTag(),
      seed_status: "unknown",
    });
    const rows = await list.execute();
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: { code: "INTERNAL", message } });
  }
}

function readSchemaTag(): string {
  try {
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 10; i++) {
      const candidate = join(
        dir,
        "packages",
        "database",
        "src",
        "migrations",
        "meta",
        "_journal.json"
      );
      if (existsSync(candidate)) {
        const parsed = JSON.parse(readFileSync(candidate, "utf8")) as {
          entries?: Array<{ idx: number; tag: string }>;
        };
        const entries = parsed.entries ?? [];
        const last = entries[entries.length - 1];
        return last?.tag ?? "unknown";
      }
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  } catch {
    // fall through
  }
  return "unknown";
}
