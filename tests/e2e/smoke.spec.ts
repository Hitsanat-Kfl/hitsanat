import { expect, test } from "@playwright/test";

test.describe("Frontend Smoke Tests", () => {
  test("portfolio application loads and displays ministry heading", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page).toHaveTitle(/Hitsanat Kifl/);
    await expect(page.getByText("Children's Ministry")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hitsanat Kifl" })).toBeVisible();
  });

  test("admin application loads and displays login page", async ({ page }) => {
    await page.goto("http://localhost:3002");
    await expect(page).toHaveTitle(/Hitsanat Kifl/);
    await expect(page.getByRole("heading", { name: "Hitsanat Kifl" })).toBeVisible();
  });
});
