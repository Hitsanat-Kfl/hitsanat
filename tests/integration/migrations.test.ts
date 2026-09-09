import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type postgres from "postgres";
import { createTestClient } from "./setup.js";

describe("Database Migrations", () => {
  let client: postgres.Sql | null = null;

  beforeAll(async () => {
    client = createTestClient();
  });

  afterAll(async () => {
    if (client) {
      await client.end();
    }
  });

  const tableExists = async (client: postgres.Sql, tableName: string) => {
    const result = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = ${tableName}
      )
    `;
    return result[0].exists;
  };

  const constraintExists = async (client: postgres.Sql, constraintName: string) => {
    const result = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_name = ${constraintName}
      )
    `;
    return result[0].exists;
  };

  describe("Identity & Membership Tables", () => {
    it("should have members table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "members")).toBe(true);
    });

    it("should have sub_departments table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "sub_departments")).toBe(true);
    });

    it("should have sub_department_members table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "sub_department_members")).toBe(true);
    });

    it("should have families table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "families")).toBe(true);
    });

    it("should have family_members table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "family_members")).toBe(true);
    });
  });

  describe("Beneficiary & Parent Tables", () => {
    it("should have children table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "children")).toBe(true);
    });

    it("should have parents table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "parents")).toBe(true);
    });

    it("should have child_parents table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "child_parents")).toBe(true);
    });

    it("should have unique constraint on child_parents", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await constraintExists(client, "child_parents_child_id_relation_unique")).toBe(true);
    });
  });

  describe("Planning Tables", () => {
    it("should have annual_master_plans table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "annual_master_plans")).toBe(true);
    });

    it("should have plan_goals table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "plan_goals")).toBe(true);
    });

    it("should have plan_activities table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "plan_activities")).toBe(true);
    });

    it("should have plan_distributions table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "plan_distributions")).toBe(true);
    });

    it("should have weekly_plans table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "weekly_plans")).toBe(true);
    });

    it("should have plan_progress_records table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "plan_progress_records")).toBe(true);
    });
  });

  describe("Attendance & Event Tables", () => {
    it("should have program_sessions table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "program_sessions")).toBe(true);
    });

    it("should have program_session_attendance table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "program_session_attendance")).toBe(true);
    });

    it("should have events table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "events")).toBe(true);
    });

    it("should have event_program_assignments table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "event_program_assignments")).toBe(true);
    });

    it("should have event_attendance table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "event_attendance")).toBe(true);
    });
  });

  describe("Academic & Announcement Tables", () => {
    it("should have academic_assessments table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "academic_assessments")).toBe(true);
    });

    it("should have student_scores table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "student_scores")).toBe(true);
    });

    it("should have announcements table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "announcements")).toBe(true);
    });

    it("should have audit_logs table", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await tableExists(client, "audit_logs")).toBe(true);
    });
  });

  describe("Constraints", () => {
    it("should have unique constraint on members.phone_number", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await constraintExists(client, "members_phone_number_unique")).toBe(true);
    });

    it("should have unique constraint on sub_departments.code", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await constraintExists(client, "sub_departments_code_unique")).toBe(true);
    });

    it("should have unique constraint on annual_master_plans.academic_year", async () => {
      if (!client) {
        console.warn("⚠️ Skipping: TEST_DATABASE_URL not set");
        return;
      }
      expect(await constraintExists(client, "annual_master_plans_academic_year_unique")).toBe(true);
    });
  });
});
