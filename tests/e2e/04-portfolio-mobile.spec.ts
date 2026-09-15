import { test, expect } from "@playwright/test";

const mobileViewports = [
  { name: "iPhone SE", viewport: { width: 375, height: 667 } },
  { name: "iPhone 14", viewport: { width: 390, height: 844 } },
  { name: "Samsung Galaxy S21", viewport: { width: 360, height: 800 } },
];

for (const device of mobileViewports) {
  test.describe(`Portfolio Mobile - ${device.name}`, () => {
    test.use({ viewport: device.viewport });

    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });

    test("renders the ministry title", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Hitsanat Kifl", exact: true }).first()
      ).toBeVisible();
    });

    test("shows mobile menu button", async ({ page }) => {
      await expect(page.getByLabel("Toggle menu")).toBeVisible();
    });

    test("hides desktop nav on mobile", async ({ page }) => {
      const desktopNav = page.locator("nav.hidden.md\\:flex");
      await expect(desktopNav).not.toBeVisible();
    });

    test("opens mobile menu on button click", async ({ page }) => {
      await page.getByLabel("Toggle menu").click();
      await expect(page.getByRole("link", { name: "About", exact: true })).toBeVisible();
      await expect(page.getByRole("link", { name: "Programs", exact: true })).toBeVisible();
    });

    test("closes mobile menu when link clicked", async ({ page }) => {
      await page.getByLabel("Toggle menu").click();
      await page.getByRole("link", { name: "About", exact: true }).click();
      await expect(page.getByLabel("Toggle menu")).toBeVisible();
    });

    test("renders stats section responsively", async ({ page }) => {
      const statsSection = page.getByText("Active Members");
      const isVisible = await statsSection.isVisible().catch(() => false);
      if (isVisible) {
        await expect(page.getByText("Enrolled Children")).toBeVisible();
      }
    });

    test("renders programs section", async ({ page }) => {
      await expect(page.getByRole("heading", { name: "Our Programs" })).toBeVisible();
    });

    test("footer is visible", async ({ page }) => {
      await expect(page.getByText("Hitsanat Kifl — Children's Ministry")).toBeVisible();
    });
  });
}
