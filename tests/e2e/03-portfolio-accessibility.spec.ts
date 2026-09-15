import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("Portfolio Accessibility (WCAG 2.1 AA)", () => {
  test("home page has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("programs page has no accessibility violations", async ({ page }) => {
    await page.goto("/programs/timihrt");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("all images and SVGs have alt text", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).toBeTruthy();
    }

    const svgs = page.locator("svg[role='img']");
    const svgCount = await svgs.count();
    for (let i = 0; i < svgCount; i++) {
      const ariaLabel = await svgs.nth(i).getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
    }
  });

  test("page has at least one h1", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const h1 = page.locator("h1");
    const count = await h1.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
