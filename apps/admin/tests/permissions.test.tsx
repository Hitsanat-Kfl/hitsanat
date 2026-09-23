import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  GlobalRole,
  PERMISSION_MATRIX,
  SUB_DEPT_PERMISSIONS,
  type SubDepartmentCode,
} from "@repo/permissions";
import PermissionsPage from "../src/features/permissions/components/permissions-page";
import { renderWithProviders } from "./test-providers";

function renderPermissions() {
  return renderWithProviders(<PermissionsPage />);
}

/** Main role matrix only (mobile + desktop); excludes the sub-dept table. */
function mainMatrixAllowed() {
  const tables = screen.getAllByRole("table");
  // Order: mobile matrix, desktop matrix, sub-department table.
  return tables
    .slice(0, 2)
    .flatMap((table) => within(table).queryAllByRole("img", { name: "Allowed" }));
}

function subDeptTable() {
  const tables = screen.getAllByRole("table");
  return tables[tables.length - 1];
}

function roleSelect() {
  return screen.getAllByRole("combobox")[0];
}

describe("Roles & Permissions page", () => {
  it("renders the page header, role directory, and permission matrix", () => {
    renderPermissions();

    expect(screen.getByRole("heading", { level: 1, name: "Roles & Permissions" })).toBeDefined();
    expect(screen.getByText("Role Directory")).toBeDefined();
    expect(screen.getAllByText("SUPER ADMIN").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("CHAIRPERSON").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("SUB-CHAIRPERSON").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("SECRETARY").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("MEMBER").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Permission Matrix").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Members").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Announcements").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Approve").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sub-Departments").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Attendance").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Academic").length).toBeGreaterThanOrEqual(1);
  });

  it("marks cells from PERMISSION_MATRIX (source of truth, not a hand copy)", () => {
    renderPermissions();

    expect(mainMatrixAllowed()).toHaveLength(PERMISSION_MATRIX[GlobalRole.SUPER_ADMIN].length * 2);
  });

  it("updates the matrix when a different role is selected", () => {
    renderPermissions();

    fireEvent.change(roleSelect(), { target: { value: GlobalRole.CHAIRPERSON } });

    expect(mainMatrixAllowed()).toHaveLength(PERMISSION_MATRIX[GlobalRole.CHAIRPERSON].length * 2);
    expect(screen.getAllByText("CHAIRPERSON").length).toBeGreaterThanOrEqual(3);
  });

  it("shows no allowed actions for regular members (ADR-0007)", () => {
    renderPermissions();

    fireEvent.change(roleSelect(), { target: { value: "MEMBER_REGULAR" } });

    expect(mainMatrixAllowed()).toHaveLength(0);
    expect(screen.getAllByText("MEMBER").length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText("No system access").length).toBeGreaterThanOrEqual(1);
  });
});

describe("Sub-department leadership section", () => {
  it("lists all five sub-departments and the three leadership posts", () => {
    renderPermissions();

    expect(screen.getByText("Sub-Department Leadership")).toBeDefined();
    expect(screen.getAllByText("TIMIHRT").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("MEZMUR").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("KUTITR").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("EKD").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("KINETIBEB").length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Leader / Sub-Leader")).toBeDefined();
    expect(screen.getAllByText("Secretary").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Member").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Leader scoped permissions from SUB_DEPT_PERMISSIONS for TIMIHRT", () => {
    renderPermissions();

    const allowed = within(subDeptTable()).getAllByRole("img", { name: "Allowed" });
    expect(allowed).toHaveLength(SUB_DEPT_PERMISSIONS["TIMIHRT" as SubDepartmentCode].length);
  });

  it("restricts the Secretary post to C/R/U subset of the department set", () => {
    renderPermissions();

    fireEvent.click(screen.getByRole("button", { name: /Secretary/ }));

    const expected = SUB_DEPT_PERMISSIONS["TIMIHRT" as SubDepartmentCode].filter(
      (p) => p.action === "C" || p.action === "R" || p.action === "U"
    ).length;
    const allowed = within(subDeptTable()).getAllByRole("img", { name: "Allowed" });
    expect(allowed).toHaveLength(expected);
    expect(expected).toBeLessThan(SUB_DEPT_PERMISSIONS["TIMIHRT" as SubDepartmentCode].length);
  });

  it("shows zero access for the plain Member post (ADR-0007)", () => {
    renderPermissions();

    fireEvent.click(screen.getByRole("button", { name: /^Member/ }));

    const allowed = within(subDeptTable()).queryAllByRole("img", { name: "Allowed" });
    expect(allowed).toHaveLength(0);
  });

  it("switches the scoped table when another sub-department is selected", () => {
    renderPermissions();

    fireEvent.click(screen.getByRole("button", { name: /KUTITR/ }));

    const allowed = within(subDeptTable()).getAllByRole("img", { name: "Allowed" });
    expect(allowed).toHaveLength(SUB_DEPT_PERMISSIONS["KUTITR" as SubDepartmentCode].length);
  });
});
