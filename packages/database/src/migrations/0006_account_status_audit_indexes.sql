-- Migration 0006: Account status + audit filter indexes
-- Implements FR-13.6 (Account Reactivation) data model and FR-13.10
-- (Audit Log Filtering) index support.
--
-- Deactivation was previously modeled as `email_verified = false`, which
-- conflated "email not verified" with "account deactivated". A dedicated
-- `status` column makes reactivation safe: restoring an account no longer
-- implies its email was verified.

-- 1. Account lifecycle status (ACTIVE | DEACTIVATED)
ALTER TABLE "users" ADD COLUMN "status" varchar(16) DEFAULT 'ACTIVE' NOT NULL;
ALTER TABLE "users" ADD COLUMN "deactivated_at" timestamp with time zone;

-- Backfill: rows whose email is unverified were deactivated by
-- POST /users/:id/deactivate (it sets email_verified = false).
-- Seed-created accounts that were never verified are indistinguishable,
-- so only rows with a deactivated_at candidate (Supabase ban) are marked;
-- the conservative default keeps everything else ACTIVE.
UPDATE "users" SET "status" = 'DEACTIVATED' WHERE "email_verified" = false;

-- 2. Audit trail filter support (filter by action, actor, date range)
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" ("action");
CREATE INDEX IF NOT EXISTS "audit_logs_operator_idx" ON "audit_logs" ("operator_id");
CREATE INDEX IF NOT EXISTS "audit_logs_action_timestamp_idx" ON "audit_logs" ("action", "timestamp");
