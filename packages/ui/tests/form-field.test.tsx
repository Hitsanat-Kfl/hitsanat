import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "../src/components/ui/form-field";
import { Input } from "../src/components/ui/input";

describe("FormField", () => {
  it("renders children", () => {
    render(
      <FormField>
        <Input />
      </FormField>
    );
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("renders label", () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>
    );
    expect(screen.getByText("Email")).toBeDefined();
  });

  it("renders required indicator with label", () => {
    render(
      <FormField label="Email" required>
        <Input />
      </FormField>
    );
    expect(screen.getByText("Email")).toBeDefined();
    expect(screen.getByText("*")).toBeDefined();
  });

  it("renders error message", () => {
    render(
      <FormField label="Email" error="Email is required">
        <Input />
      </FormField>
    );
    expect(screen.getByText("Email is required")).toBeDefined();
    expect(screen.getByText("Email is required").className).toContain("text-destructive");
  });

  it("renders helper text when no error", () => {
    render(
      <FormField label="Email" helperText="Enter your email address">
        <Input />
      </FormField>
    );
    expect(screen.getByText("Enter your email address")).toBeDefined();
  });

  it("does not render helper text when error is present", () => {
    render(
      <FormField label="Email" error="Error" helperText="Helper">
        <Input />
      </FormField>
    );
    expect(screen.queryByText("Helper")).toBeNull();
    expect(screen.getByText("Error")).toBeDefined();
  });

  it("applies custom className", () => {
    render(
      <FormField className="custom-form-field">
        <Input />
      </FormField>
    );
    expect(screen.getByRole("textbox").parentElement?.className).toContain("custom-form-field");
  });

  it("sets aria-describedby on child when error is present", () => {
    render(
      <FormField label="Email" error="Email is required">
        <Input id="email" />
      </FormField>
    );
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBeDefined();
  });
});
