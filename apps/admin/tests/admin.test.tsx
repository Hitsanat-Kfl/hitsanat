import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminDashboardPage from "../app/page.js";

describe("Admin Shell & Dashboard Page", () => {
  it("renders the admin shell navigation and dashboard title", () => {
    render(<AdminDashboardPage />);

    expect(screen.getByText("Hitsanat Admin")).toBeDefined();
    expect(screen.getByText("Ministry Administration")).toBeDefined();
    expect(screen.getByText("Admin Shell Overview")).toBeDefined();
  });
});
