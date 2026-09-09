import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, badgeVariants } from "../src/components/ui/badge";

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByRole("status");
    expect(badge).toBeDefined();
    expect(badge.className).toContain("bg-primary");
    expect(badge.textContent).toContain("Default");
  });

  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByRole("status");
    expect(badge.className).toContain("bg-secondary");
  });

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Error</Badge>);
    const badge = screen.getByRole("status");
    expect(badge.className).toContain("bg-destructive");
  });

  it("renders with outline variant", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByRole("status");
    expect(badge.className).toContain("border-current");
  });

  it("renders with success variant", () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByRole("status");
    expect(badge.className).toContain("text-success");
  });

  it("renders with warning variant", () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByRole("status");
    expect(badge.className).toContain("text-warning");
  });

  it("renders with info variant", () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByRole("status");
    expect(badge.className).toContain("text-info");
  });

  it("renders with dot indicator", () => {
    render(<Badge showDot>With Dot</Badge>);
    const badge = screen.getByRole("status");
    expect(badge.querySelector('[aria-hidden="true"]')).toBeDefined();
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByRole("status");
    expect(badge.className).toContain("custom-class");
  });

  it("has status role", () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByRole("status")).toBeDefined();
  });
});

describe("badgeVariants", () => {
  it("generates correct class strings for all variants", () => {
    expect(badgeVariants({ variant: "default" })).toContain("bg-primary");
    expect(badgeVariants({ variant: "secondary" })).toContain("bg-secondary");
    expect(badgeVariants({ variant: "destructive" })).toContain("bg-destructive");
    expect(badgeVariants({ variant: "outline" })).toContain("border-current");
    expect(badgeVariants({ variant: "success" })).toContain("text-success");
    expect(badgeVariants({ variant: "warning" })).toContain("text-warning");
    expect(badgeVariants({ variant: "info" })).toContain("text-info");
  });
});
