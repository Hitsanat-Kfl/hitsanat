-- BR-007: Leader Must Be a Member Invariant
-- Every executive leader (SUPER_ADMIN, CHAIRPERSON, SUB_CHAIRPERSON, SECRETARY)
-- MUST be linked to a registered, active member. Regular members have no account link.

-- 1. Add member link column (guarded for idempotent re-runs)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "member_id" uuid;

-- 2-4. Constraints (guarded — Postgres has no ADD CONSTRAINT IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_member_id_unique') THEN
    -- 2. Enforce uniqueness: one user account per member
    ALTER TABLE "users" ADD CONSTRAINT "users_member_id_unique" UNIQUE ("member_id");
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_member_id_members_id_fk') THEN
    -- 3. FK to members (restrict delete so members cannot be silently removed while linked)
    ALTER TABLE "users" ADD CONSTRAINT "users_member_id_members_id_fk"
      FOREIGN KEY ("member_id") REFERENCES "public"."members"("id")
      ON DELETE restrict ON UPDATE no action;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_leadership_requires_member_check') THEN
    -- 4. BR-007 invariant: leadership roles require member_id; MEMBER_REGULAR may be null.
    -- NOTE: data must be backfilled first (scripts/backfill-leader-members.ts)
    -- or this will fail on databases with pre-existing unlinked leaders.
    ALTER TABLE "users" ADD CONSTRAINT "users_leadership_requires_member_check" CHECK (
      (
        role IN ('SUPER_ADMIN', 'CHAIRPERSON', 'SUB_CHAIRPERSON', 'SECRETARY')
        AND member_id IS NOT NULL
      )
      OR
      (
        role NOT IN ('SUPER_ADMIN', 'CHAIRPERSON', 'SUB_CHAIRPERSON', 'SECRETARY')
      )
    );
  END IF;
END
$$;

-- 5. Index for role lookups and member joins
CREATE INDEX IF NOT EXISTS "users_member_id_idx" ON "users" ("member_id");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");
