-- Migration 0010: Temporary permission grants (BR-035 / ADR-0019)
-- SUPER_ADMIN may grant a single resource+action to any user for a
-- bounded window. requireScopePermission consults active rows when
-- role-based checks fail for that resource+action.

CREATE TABLE IF NOT EXISTS "permission_grants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "resource" varchar(64) NOT NULL,
  "action" varchar(8) NOT NULL,
  "reason" text,
  "expires_at" timestamp with time zone NOT NULL,
  "revoked_at" timestamp with time zone,
  "granted_by" uuid REFERENCES "users" ("id") ON DELETE SET NULL,
  "revoked_by" uuid REFERENCES "users" ("id") ON DELETE SET NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "permission_grants_user_idx" ON "permission_grants" ("user_id");
CREATE INDEX IF NOT EXISTS "permission_grants_user_resource_action_idx"
  ON "permission_grants" ("user_id", "resource", "action");
