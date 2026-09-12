import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "../src/components/ui/separator";
import { Skeleton } from "../src/components/ui/skeleton";

describe("Separator", () => {
  it("renders horizontal by default", () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toBeDefined();
    expect(separator.className).toContain("h-[1px]");
    expect(separator.className).toContain("w-full");
  });

  it("renders vertical orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.className).toContain("h-full");
    expect(separator.className).toContain("w-[1px]");
  });

  it("has decorative role by default", () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.getAttribute("role")).toBe("none");
  });

  it("has separator role when not decorative", () => {
    const { container } = render(<Separator decorative={false} />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.getAttribute("role")).toBe("separator");
    expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("applies custom className", () => {
    const { container } = render(<Separator className="custom-separator" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator.className).toContain("custom-separator");
  });
});

describe("Skeleton", () => {
  it("renders with default styling", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toBeDefined();
    expect(skeleton.className).toContain("animate-pulse");
    expect(skeleton.className).toContain("rounded-md");
    expect(skeleton.className).toContain("bg-muted");
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.className).toContain("custom-skeleton");
  });
});
