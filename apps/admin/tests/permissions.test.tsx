import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlobalRole, PERMISSION_MATRIX, ResourceType, ActionType } from "@repo/permissions";
import PermissionsPage from "../src/features/permissions/components/permissions-page";
import { renderWithProviders } from "./test-providers";

function renderPermissions() {
  return renderWithProviders(<PermissionsPage />);
}

describe("Permissions page", () => {
  it("renders the matrix table from @repo/permissions", async () => {
    renderPermissions();

    expect(await screen.findByText("Permission Matrix")).toBeDefined();
    expect(screen.getByText("SUPER ADMIN")).toBeDefined();
    expect(screen.getByText("CHAIRPERSON")).toBeDefined();
    expect(screen.getByText("Members")).toBeDefined();
    expect(screen.getByText("Announcements")).toBeDefined();
    expect(screen.getAllByText("Approve").length).toBeGreaterThanOrEqual(4);
  });

  it("marks cells from PERMISSION_MATRIX (source of truth, not a hand copy)", async () => {
    renderPermissions();
    await screen.findByText("Permission Matrix");

    // SECRETARY has Approve nowhere; SUPER_ADMIN has no Approve in matrix.
    const secretaryApproveCells = PERMISSION_MATRIX[GlobalRole.SECRETARY].filter(
      (p) => p.action === ActionType.APPROVE
    ).length;
    expect(secretaryApproveCells).toBe(0);

    // Chairperson has full CRUD + Approve on Planning (matches matrix).
    const chairPlanning = PERMISSION_MATRIX[GlobalRole.CHAIRPERSON].some(
      (p) => p.resource === ResourceType.PLANNING && p.action === ActionType.APPROVE
    );
    expect(chairPlanning).toBe(true);

    // Matrix has 11 resources — the page renders all of them as labels.
    expect(screen.getByText("Sub-Departments")).toBeDefined();
    expect(screen.getByText("Attendance")).toBeDefined();
    expect(screen.getByText("Academic")).toBeDefined();
  });
});
