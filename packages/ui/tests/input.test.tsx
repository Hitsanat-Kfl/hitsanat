import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../src/components/ui/input";

describe("Input", () => {
  it("renders with default props", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeDefined();
    expect(input.tagName).toBe("INPUT");
  });

  it("renders with text type", () => {
    render(<Input type="text" />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("renders with password type", () => {
    render(<Input type="password" />);
    const input = document.querySelector("input[type='password']");
    expect(input).toBeDefined();
  });

  it("renders disabled state", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input.hasAttribute("disabled")).toBe(true);
  });

  it("renders error state", () => {
    render(<Input error />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.className).toContain("border-destructive");
  });

  it("renders success state", () => {
    render(<Input success />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("border-success");
  });

  it("applies custom className", () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("custom-input");
  });

  it("has correct touch target height on mobile", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("h-11");
  });

  it("has accessible focus ring", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("focus-visible:ring-2");
  });
});
