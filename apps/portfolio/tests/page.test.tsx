import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../app/page.js";

describe("Portfolio HomePage", () => {
  it("renders the welcome title and badge correctly", () => {
    render(<HomePage />);

    expect(screen.getByText("ህፃናት ክፍል — Children's Ministry")).toBeDefined();

    expect(screen.getByText("Hitsanat Kifl Portal")).toBeDefined();
    expect(screen.getByText("Welcome to Hitsanat Kifl")).toBeDefined();
  });
});
