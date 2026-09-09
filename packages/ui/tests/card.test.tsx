import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  cardVariants,
} from "../src/components/ui/card";

describe("Card", () => {
  it("renders with default variant", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toBeDefined();
    expect(card?.className).toContain("shadow-sm");
  });

  it("renders with outlined variant", () => {
    const { container } = render(<Card variant="outlined">Outlined</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toBeDefined();
    expect(card?.className).toContain("shadow-none");
  });

  it("renders with elevated variant", () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toBeDefined();
    expect(card?.className).toContain("shadow-elevation-md");
  });

  it("renders with interactive variant", () => {
    const { container } = render(<Card variant="interactive">Interactive</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toBeDefined();
    expect(card?.className).toContain("cursor-pointer");
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom-card">Custom</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toBeDefined();
    expect(card?.className).toContain("custom-card");
  });
});

describe("Card sub-components", () => {
  it("renders CardHeader", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>
    );
    expect(screen.getByText("Header")).toBeDefined();
  });

  it("renders CardTitle", () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>
    );
    expect(screen.getByText("Title")).toBeDefined();
  });

  it("renders CardDescription", () => {
    render(
      <Card>
        <CardDescription>Description</CardDescription>
      </Card>
    );
    expect(screen.getByText("Description")).toBeDefined();
  });

  it("renders CardContent", () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(screen.getByText("Content")).toBeDefined();
  });

  it("renders CardFooter", () => {
    render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText("Footer")).toBeDefined();
  });

  it("renders CardAction", () => {
    render(
      <Card>
        <CardAction>Action</CardAction>
      </Card>
    );
    expect(screen.getByText("Action")).toBeDefined();
  });

  it("composes full card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText("Card Title")).toBeDefined();
    expect(screen.getByText("Card Description")).toBeDefined();
    expect(screen.getByText("Card Content")).toBeDefined();
    expect(screen.getByText("Card Footer")).toBeDefined();
  });
});

describe("cardVariants", () => {
  it("generates correct class strings for all variants", () => {
    expect(cardVariants({ variant: "default" })).toContain("shadow-sm");
    expect(cardVariants({ variant: "outlined" })).toContain("border-border-strong");
    expect(cardVariants({ variant: "elevated" })).toContain("shadow-elevation-md");
    expect(cardVariants({ variant: "interactive" })).toContain("cursor-pointer");
  });
});
