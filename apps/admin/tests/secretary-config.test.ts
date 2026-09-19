import { describe, expect, it } from "vitest";
import {
  defaultConfig,
  getDashboardConfig,
  getSectionsForRole,
  secretaryConfig,
} from "../features/dashboard/config";

describe("secretary dashboard config (Phase 06)", () => {
  it("maps the secretary role to its own config, not the placeholder", () => {
    expect(getDashboardConfig("secretary")).toBe(secretaryConfig);
    expect(getDashboardConfig("secretary")).not.toBe(defaultConfig);
  });

  it("follows the Phase 06 information hierarchy (spec §6)", () => {
    const sectionIds = secretaryConfig.sections.map((section) => section.id);

    expect(sectionIds).toEqual([
      "registration-overview",
      "attention",
      "records-overview",
      "recent-activity",
      "upcoming",
      "actions",
    ]);
  });

  it("defines four administrative overview KPIs", () => {
    const overview = secretaryConfig.sections[0];
    expect(overview?.id).toBe("registration-overview");
    expect(overview?.widgets.filter((w) => w.type === "kpi")).toHaveLength(4);
  });

  it("exposes sections through getSectionsForRole", () => {
    expect(getSectionsForRole("secretary")).toEqual(secretaryConfig.sections);
  });

  it("provides Amharic titles for every section", () => {
    for (const section of secretaryConfig.sections) {
      expect(section.titleAm, `section ${section.id} missing titleAm`).toBeTruthy();
    }
  });
});
