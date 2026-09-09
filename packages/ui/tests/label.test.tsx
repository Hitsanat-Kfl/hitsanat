import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "../src/components/ui/label";

describe("Label", () => {
  it("renders with text content", () => {
    render(<Label>Name</Label>);
    expect(screen.getByText("Name")).toBeDefined();
  });

  it("renders as label element", () => {
    render(<Label>Name</Label>);
    const label = screen.getByText("Name");
    expect(label.tagName).toBe("LABEL");
  });

  it("renders required indicator", () => {
    render(<Label required>Name</Label>);
    expect(screen.getByText("*")).toBeDefined();
    expect(screen.getByText("*").className).toContain("text-destructive");
  });

  it("renders error state", () => {
    render(<Label error>Name</Label>);
    const label = screen.getByText("Name");
    expect(label.className).toContain("text-destructive");
  });

  it("applies custom className", () => {
    render(<Label className="custom-label">Name</Label>);
    expect(screen.getByText("Name").className).toContain("custom-label");
  });

  it("has proper typography", () => {
    render(<Label>Name</Label>);
    const label = screen.getByText("Name");
    expect(label.className).toContain("text-xs");
    expect(label.className).toContain("font-medium");
  });
});
