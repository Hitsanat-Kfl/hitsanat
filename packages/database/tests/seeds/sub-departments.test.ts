import { describe, it, expect } from "vitest";
import { subDepartments } from "../../src/seeds/sub-departments.js";

describe("Sub-Departments Seed Script", () => {
  describe("subDepartments data", () => {
    it("should define exactly 5 sub-departments", () => {
      expect(subDepartments).toHaveLength(5);
    });

    it("should have unique codes for each department", () => {
      const codes = subDepartments.map((d) => d.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(5);
    });

    it("should include TIMIHRT department with correct names", () => {
      const timihrt = subDepartments.find((d) => d.code === "TIMIHRT");
      expect(timihrt).toBeDefined();
      expect(timihrt?.name_am).toBe("ትምህርት");
      expect(timihrt?.name_en).toBe("Education");
    });

    it("should include MEZMUR department with correct names", () => {
      const mezmur = subDepartments.find((d) => d.code === "MEZMUR");
      expect(mezmur).toBeDefined();
      expect(mezmur?.name_am).toBe("መዝሙር");
      expect(mezmur?.name_en).toBe("Worship");
    });

    it("should include KUTITR department with correct names", () => {
      const kutitr = subDepartments.find((d) => d.code === "KUTITR");
      expect(kutitr).toBeDefined();
      expect(kutitr?.name_am).toBe("ኩትትር");
      expect(kutitr?.name_en).toBe("Children");
    });

    it("should include EKD department with correct names", () => {
      const ekd = subDepartments.find((d) => d.code === "EKD");
      expect(ekd).toBeDefined();
      expect(ekd?.name_am).toBe("ኢክድ");
      expect(ekd?.name_en).toBe("EKD");
    });

    it("should include KINETIBEB department with correct names", () => {
      const kinetibeb = subDepartments.find((d) => d.code === "KINETIBEB");
      expect(kinetibeb).toBeDefined();
      expect(kinetibeb?.name_am).toBe("ኪነጠበብ");
      expect(kinetibeb?.name_en).toBe("Sports");
    });

    it("should have descriptions for all departments", () => {
      for (const dept of subDepartments) {
        expect(dept.description).toBeDefined();
        expect(typeof dept.description).toBe("string");
        expect(dept.description.length).toBeGreaterThan(0);
      }
    });
  });
});
