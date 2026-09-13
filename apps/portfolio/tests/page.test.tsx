import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Portfolio HomePage", () => {
  it("renders the ministry title", () => {
    const { container } = render(
      <main>
        <section>
          <h1>Hitsanat Kifl</h1>
          <p>Children&apos;s Ministry</p>
        </section>
      </main>
    );

    expect(screen.getByText("Hitsanat Kifl")).toBeDefined();
    expect(screen.getByText("Children's Ministry")).toBeDefined();
  });
});
