-- Audit log index for recent-activity queries (dashboard, audit overview).
-- The audit_logs table itself was created in migration 0000; this only adds
-- the index that the newest-first listing scans on.
CREATE INDEX IF NOT EXISTS "audit_logs_timestamp_idx" ON "audit_logs" ("timestamp");
