import type {
  AuditActor,
  AuditLogRepository,
  RecordAuditInput,
} from "../../domain/repositories/audit-log.repository.js";

/**
 * Records one administrative action. Audit writes are best-effort by design:
 * a broken audit sink must not roll back or fail the primary action
 * (e.g. a successful password reset). Failures are logged server-side.
 */
export class RecordAuditLogUseCase {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async execute(actor: AuditActor, input: RecordAuditInput): Promise<void> {
    try {
      await this.auditLogRepository.record(actor, input);
    } catch (error) {
      console.error("[audit] failed to record audit log:", error);
    }
  }
}
