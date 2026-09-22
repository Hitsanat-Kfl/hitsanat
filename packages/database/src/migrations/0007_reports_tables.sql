-- Migration 0007: Periodic Reports & Report Submissions tables
-- The schema code (schema/reports.ts) and API modules (reports) reference
-- these tables, but no earlier migration in this chain created them — fresh
-- environments failed at "relation report_submissions does not exist".
-- This migration adds them so `drizzle-kit migrate` runs clean from zero.

CREATE TABLE IF NOT EXISTS "periodic_reports" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "report_type" varchar(16) NOT NULL,
  "period_label" varchar(64) NOT NULL,
  "period_start" timestamp with time zone NOT NULL,
  "period_end" timestamp with time zone NOT NULL,
  "sub_department_id" uuid,
  "generated_by" uuid NOT NULL,
  "status" varchar(16) DEFAULT 'Draft' NOT NULL,
  "metrics" jsonb,
  "challenges" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "report_submissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "report_type" varchar(16) NOT NULL,
  "period_label" varchar(64) NOT NULL,
  "sub_department_id" uuid NOT NULL,
  "submitted_by" uuid NOT NULL,
  "status" varchar(16) DEFAULT 'Submitted' NOT NULL,
  "metrics" jsonb,
  "challenges" text,
  "notes" text,
  "reviewed_by" uuid,
  "reviewed_at" timestamp with time zone,
  "review_comments" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "periodic_reports_status_idx" ON "periodic_reports" ("status");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "report_submissions_status_idx" ON "report_submissions" ("status");
