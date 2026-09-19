import { describe, expect, it } from "vitest";
import {
  defaultConfig,
  getDashboardConfig,
  getSectionsForRole,
  subChairpersonConfig,
} from "../features/dashboard/config";

describe("sub-chairperson dashboard config (Phase 06)", () => {
  it("maps the sub-chairperson role to its own config, not the placeholder", () => {
    expect(getDashboardConfig("sub-chairperson")).toBe(subChairpersonConfig);
    expect(getDashboardConfig("sub-chairperson")).not.toBe(defaultConfig);
  });

  it("follows the Phase 06 information hierarchy (spec §4)", () => {
    const sectionIds = subChairpersonConfig.sections.map((section) => section.id);

    expect(sectionIds).toEqual([
      "coordination-overview",
      "attention",
      "progress",
      "responsibilities",
      "upcoming",
      "recent-activity",
      "actions",
    ]);
  });

  it("defines four coordination KPIs", () => {
    const overview = subChairpersonConfig.sections[0];
    expect(overview?.id).toBe("coordination-overview");
    expect(overview?.widgets.filter((w) => w.type === "kpi")).toHaveLength(4);
  });

  it("exposes sections through getSectionsForRole", () => {
    expect(getSectionsForRole("sub-chairperson")).toEqual(subChairpersonConfig.sections);
  });

  it("provides Amharic titles for every section (spec §22)", () => {
    for (const section of subChairpersonConfig.sections) {
      expect(section.titleAm, `section ${section.id} missing titleAm`).toBeTruthy();
    }
  });
});
