-- Migration 0008: Meetings + Plan Approvals + Report review comments
-- Implements the Chairperson feature set:
--   FR-13.1.1 / BR-019 — leadership meetings (create: CHAIRPERSON,
--     SUB_CHAIRPERSON, SECRETARY; update/cancel: CHAIRPERSON only)
--   FR-17.1 / BR-025   — plan approval workflow with review comments
--   Reports            — chairperson review comments on report submissions

-- 1. Leadership meetings
CREATE TABLE IF NOT EXISTS "meetings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text,
  "scheduled_at" timestamp with time zone NOT NULL,
  "duration_minutes" integer DEFAULT 60 NOT NULL,
  "location" varchar(255),
  "agenda" text,
  "status" varchar(16) DEFAULT 'Scheduled' NOT NULL,
  "minutes" text,
  "minutes_recorded_by" uuid,
  "minutes_recorded_at" timestamp with time zone,
  "created_by" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "meetings_scheduled_at_idx" ON "meetings" ("scheduled_at");
CREATE INDEX IF NOT EXISTS "meetings_status_idx" ON "meetings" ("status");

-- 2. Meeting invitees (executive leaders + sub-dept leaders, BR-019)
CREATE TABLE IF NOT EXISTS "meeting_invitees" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "meeting_id" uuid NOT NULL REFERENCES "meetings"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL,
  "member_id" uuid,
  "response_status" varchar(16) DEFAULT 'Pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "meeting_invitees_meeting_idx" ON "meeting_invitees" ("meeting_id");

-- 3. Plan approval workflow (FR-17.1 / BR-025)
CREATE TABLE IF NOT EXISTS "plan_approvals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "annual_plan_id" uuid NOT NULL REFERENCES "annual_master_plans"("id") ON DELETE CASCADE,
  "requested_by" uuid NOT NULL,
  "change_summary" text NOT NULL,
  "status" varchar(24) DEFAULT 'Pending' NOT NULL,
  "review_comments" text,
  "reviewed_by" uuid,
  "reviewed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "plan_approvals_plan_idx" ON "plan_approvals" ("annual_plan_id");
CREATE INDEX IF NOT EXISTS "plan_approvals_status_idx" ON "plan_approvals" ("status");

-- 4. Chairperson review comments on report submissions
ALTER TABLE "report_submissions" ADD COLUMN IF NOT EXISTS "review_comments" text;
