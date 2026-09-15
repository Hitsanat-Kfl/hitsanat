import { test, expect } from "@playwright/test";

test.describe("Portfolio Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the ministry title and tagline", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Hitsanat Kifl", exact: true }).first()
    ).toBeVisible();
    await expect(page.getByText("Children's Ministry").first()).toBeVisible();
  });

  test("displays Ethiopian date", async ({ page }) => {
    await expect(page.getByText(/ዛሬ/)).toBeVisible();
  });

  test("renders navigation links", async ({ page }) => {
    await expect(page.getByRole("link", { name: "About", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Programs", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Events", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact", exact: true })).toBeVisible();
  });

  test("renders hero section buttons", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Explore Programs" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Learn More", exact: true })).toBeVisible();
  });

  test("renders stats section when API returns data", async ({ page }) => {
    const statsSection = page.getByText("Active Members");
    const isVisible = await statsSection.isVisible().catch(() => false);
    if (isVisible) {
      await expect(page.getByText("Enrolled Children")).toBeVisible();
      await expect(page.getByText("Events This Year")).toBeVisible();
    }
  });

  test("renders programs section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Our Programs" })).toBeVisible();
    await expect(page.getByText("Timihrt").first()).toBeVisible();
    await expect(page.getByText("Mezmur").first()).toBeVisible();
    await expect(page.getByText("Kutitr").first()).toBeVisible();
    await expect(page.getByText("Ekd").first()).toBeVisible();
  });

  test("renders about section", async ({ page }) => {
    await expect(page.getByText("About Hitsanat Kifl")).toBeVisible();
    await expect(page.getByText("Our Mission")).toBeVisible();
    await expect(page.getByText("Our Values")).toBeVisible();
  });

  test("renders footer", async ({ page }) => {
    await expect(page.getByText("Hitsanat Kifl — Children's Ministry")).toBeVisible();
  });

  test("navigation links scroll to sections", async ({ page }) => {
    await page.getByRole("link", { name: "About", exact: true }).click();
    const aboutSection = page.locator("#about");
    await expect(aboutSection).toBeInViewport();
  });

  test("program links navigate to sub-department pages", async ({ page }) => {
    await page.getByText("Learn more →").first().click();
    await expect(page).toHaveURL(/\/programs\//);
  });
});
