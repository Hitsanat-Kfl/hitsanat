import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarGroup } from "../src/components/ui/avatar";

describe("Avatar", () => {
  it("renders with initials from name", () => {
    const { container } = render(<Avatar name="John Doe" />);
    expect(screen.getByText("JD")).toBeDefined();
    expect(container.querySelector(".inline-flex")?.className).toContain("rounded-full");
  });

  it("renders fallback when no name or src", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeDefined();
  });

  it("renders with single word name", () => {
    render(<Avatar name="John" />);
    expect(screen.getByText("J")).toBeDefined();
  });

  it("renders image when src is provided", () => {
    render(<Avatar src="/test.jpg" alt="Test avatar" name="Test" />);
    const img = screen.getByRole("img", { name: /test avatar/i });
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toBe("/test.jpg");
  });

  it("renders different sizes", () => {
    const { rerender, container } = render(<Avatar name="John Doe" size="sm" />);
    expect(container.querySelector(".inline-flex")?.className).toContain("h-8");

    rerender(<Avatar name="John Doe" size="lg" />);
    expect(container.querySelector(".inline-flex")?.className).toContain("h-14");

    rerender(<Avatar name="John Doe" size="xl" />);
    expect(container.querySelector(".inline-flex")?.className).toContain("h-20");
  });

  it("renders status indicator when showStatus is true", () => {
    render(<Avatar name="John Doe" showStatus status="online" />);
    expect(screen.getByLabelText("Status: online")).toBeDefined();
  });

  it("renders different status colors", () => {
    const { rerender } = render(<Avatar name="John Doe" showStatus status="online" />);
    expect(screen.getByLabelText("Status: online").className).toContain("bg-emerald-500");

    rerender(<Avatar name="John Doe" showStatus status="away" />);
    expect(screen.getByLabelText("Status: away").className).toContain("bg-amber-500");

    rerender(<Avatar name="John Doe" showStatus status="offline" />);
    expect(screen.getByLabelText("Status: offline").className).toContain("bg-muted-foreground/50");
  });

  it("applies custom className", () => {
    const { container } = render(<Avatar name="John Doe" className="custom-avatar" />);
    expect(container.querySelector(".inline-flex")?.className).toContain("custom-avatar");
  });
});

describe("AvatarGroup", () => {
  it("renders max avatars by default", () => {
    render(
      <AvatarGroup>
        <Avatar name="Alice Smith" />
        <Avatar name="Bob Jones" />
        <Avatar name="Carol White" />
        <Avatar name="Dave Brown" />
      </AvatarGroup>
    );
    expect(screen.getByText("AS")).toBeDefined();
    expect(screen.getByText("BJ")).toBeDefined();
    expect(screen.getByText("CW")).toBeDefined();
    expect(screen.queryByText("DB")).toBeNull();
    expect(screen.getByText("+1")).toBeDefined();
  });

  it("renders custom max", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Alice Smith" />
        <Avatar name="Bob Jones" />
        <Avatar name="Carol White" />
      </AvatarGroup>
    );
    expect(screen.getByText("AS")).toBeDefined();
    expect(screen.getByText("BJ")).toBeDefined();
    expect(screen.queryByText("CW")).toBeNull();
    expect(screen.getByText("+1")).toBeDefined();
  });
});
