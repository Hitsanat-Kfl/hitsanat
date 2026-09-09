CREATE TABLE "system_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "system_metadata_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_name" varchar(128) NOT NULL,
	"father_member_id" uuid,
	"mother_member_id" uuid,
	"academic_year" varchar(32) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"christian_name" varchar(255) NOT NULL,
	"phone_number" varchar(32) NOT NULL,
	"year_of_study" varchar(32) NOT NULL,
	"academic_department" varchar(255) NOT NULL,
	"campus" varchar(128) NOT NULL,
	"gender" varchar(16) NOT NULL,
	"photo_url" text,
	"telegram_username" varchar(128),
	"date_joined" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "members_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "sub_department_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"sub_department_id" uuid NOT NULL,
	"role" varchar(64) NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sub_departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(32) NOT NULL,
	"name_am" varchar(128) NOT NULL,
	"name_en" varchar(128) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sub_departments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "child_parents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"parent_id" uuid NOT NULL,
	"relation" varchar(16) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"christian_name" varchar(255) NOT NULL,
	"gender" varchar(16) NOT NULL,
	"date_of_birth" date NOT NULL,
	"address" text NOT NULL,
	"kutr_group" varchar(16) NOT NULL,
	"collection_location" varchar(64) NOT NULL,
	"photo_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"phone_number" varchar(32) NOT NULL,
	"secondary_phone" varchar(32),
	"address" text NOT NULL,
	"occupation" varchar(128),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "annual_master_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"academic_year" varchar(32) NOT NULL,
	"title" varchar(255) NOT NULL,
	"total_budget" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"total_people" integer DEFAULT 0 NOT NULL,
	"total_time" integer DEFAULT 0 NOT NULL,
	"status" varchar(32) NOT NULL,
	"created_by" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	CONSTRAINT "annual_master_plans_academic_year_unique" UNIQUE("academic_year")
);
--> statement-breakpoint
CREATE TABLE "plan_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_goal_id" uuid NOT NULL,
	"activity_number" integer NOT NULL,
	"main_activity" text NOT NULL,
	"expected_result" text,
	"annual_target" integer NOT NULL,
	"budget" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"human_resource" integer DEFAULT 0 NOT NULL,
	"planned_time" integer DEFAULT 0 NOT NULL,
	"weight" numeric(6, 4) NOT NULL,
	"q1_target" integer DEFAULT 0 NOT NULL,
	"q2_target" integer DEFAULT 0 NOT NULL,
	"q3_target" integer DEFAULT 0 NOT NULL,
	"q4_target" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_distributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_activity_id" uuid NOT NULL,
	"sub_department_id" uuid NOT NULL,
	"status" varchar(32) NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"annual_plan_id" uuid NOT NULL,
	"goal_number" integer NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_progress_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weekly_plan_id" uuid NOT NULL,
	"actual_result_numeric" integer,
	"actual_result_text" text,
	"status" varchar(32) NOT NULL,
	"challenges" text,
	"submitted_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_distribution_id" uuid NOT NULL,
	"ethiopian_month" varchar(32) NOT NULL,
	"week_number" integer NOT NULL,
	"session_date" timestamp with time zone NOT NULL,
	"task_description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"person_type" varchar(16) NOT NULL,
	"person_id" uuid NOT NULL,
	"status" varchar(16) NOT NULL,
	"recorded_by" uuid NOT NULL,
	"confirmed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "event_program_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"sub_department_id" uuid NOT NULL,
	"program_title" varchar(255) NOT NULL,
	"assigned_members" text
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" varchar(255) NOT NULL,
	"event_type" varchar(32) NOT NULL,
	"event_date" timestamp with time zone NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"countdown_active" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_session_attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_session_id" uuid NOT NULL,
	"person_type" varchar(16) NOT NULL,
	"person_id" uuid NOT NULL,
	"collection_location" varchar(64),
	"status" varchar(16) NOT NULL,
	"recorded_by" uuid NOT NULL,
	"confirmed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "program_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_type" varchar(16) NOT NULL,
	"session_date" date NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academic_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"curriculum_id" uuid NOT NULL,
	"assessment_type" varchar(32) NOT NULL,
	"subject_topic" varchar(255) NOT NULL,
	"max_score" numeric(5, 2) NOT NULL,
	"academic_period" varchar(32) NOT NULL,
	"exam_date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"target_audience" varchar(32) NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"publish_to_telegram" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"operator_id" uuid NOT NULL,
	"action" varchar(64) NOT NULL,
	"resource_type" varchar(64) NOT NULL,
	"resource_id" uuid NOT NULL,
	"payload_diff" text,
	"ip_address" varchar(45),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"academic_assessment_id" uuid NOT NULL,
	"child_id" uuid NOT NULL,
	"score_achieved" numeric(5, 2) NOT NULL,
	"recorded_by" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_father_member_id_members_id_fk" FOREIGN KEY ("father_member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_mother_member_id_members_id_fk" FOREIGN KEY ("mother_member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_department_members" ADD CONSTRAINT "sub_department_members_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_department_members" ADD CONSTRAINT "sub_department_members_sub_department_id_sub_departments_id_fk" FOREIGN KEY ("sub_department_id") REFERENCES "public"."sub_departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_parents" ADD CONSTRAINT "child_parents_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_parents" ADD CONSTRAINT "child_parents_parent_id_parents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_activities" ADD CONSTRAINT "plan_activities_plan_goal_id_plan_goals_id_fk" FOREIGN KEY ("plan_goal_id") REFERENCES "public"."plan_goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_distributions" ADD CONSTRAINT "plan_distributions_plan_activity_id_plan_activities_id_fk" FOREIGN KEY ("plan_activity_id") REFERENCES "public"."plan_activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_goals" ADD CONSTRAINT "plan_goals_annual_plan_id_annual_master_plans_id_fk" FOREIGN KEY ("annual_plan_id") REFERENCES "public"."annual_master_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_progress_records" ADD CONSTRAINT "plan_progress_records_weekly_plan_id_weekly_plans_id_fk" FOREIGN KEY ("weekly_plan_id") REFERENCES "public"."weekly_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_plans" ADD CONSTRAINT "weekly_plans_plan_distribution_id_plan_distributions_id_fk" FOREIGN KEY ("plan_distribution_id") REFERENCES "public"."plan_distributions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_program_assignments" ADD CONSTRAINT "event_program_assignments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_session_attendance" ADD CONSTRAINT "program_session_attendance_program_session_id_program_sessions_id_fk" FOREIGN KEY ("program_session_id") REFERENCES "public"."program_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_scores" ADD CONSTRAINT "student_scores_academic_assessment_id_academic_assessments_id_fk" FOREIGN KEY ("academic_assessment_id") REFERENCES "public"."academic_assessments"("id") ON DELETE cascade ON UPDATE no action;