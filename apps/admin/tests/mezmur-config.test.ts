import { describe, expect, it } from "vitest";
import {
  defaultConfig,
  getDashboardConfig,
  getSectionsForRole,
  mezmurLeaderConfig,
} from "../src/config/dashboard";

describe("mezmur-leader dashboard config (Phase 08)", () => {
  it("maps the mezmur-leader role to its own config, not the placeholder", () => {
    expect(getDashboardConfig("mezmur-leader")).toBe(mezmurLeaderConfig);
    expect(getDashboardConfig("mezmur-leader")).not.toBe(defaultConfig);
  });

  it("follows the Phase 08 information hierarchy (spec §4)", () => {
    const sectionIds = mezmurLeaderConfig.sections.map((section) => section.id);

    expect(sectionIds).toEqual([
      "overview",
      "attention",
      "assignments-overview",
      "responsibilities",
      "upcoming",
      "recent-activity",
      "actions",
    ]);
  });

  it("defines four Mezmur overview KPIs", () => {
    const overview = mezmurLeaderConfig.sections[0];
    expect(overview?.id).toBe("overview");
    expect(overview?.widgets.filter((w) => w.type === "kpi")).toHaveLength(4);
  });

  it("exposes sections through getSectionsForRole", () => {
    expect(getSectionsForRole("mezmur-leader")).toEqual(mezmurLeaderConfig.sections);
  });

  it("provides Amharic titles for every section", () => {
    for (const section of mezmurLeaderConfig.sections) {
      expect(section.titleAm, `section ${section.id} missing titleAm`).toBeTruthy();
    }
  });
});
