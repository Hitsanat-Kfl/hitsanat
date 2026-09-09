import { test, expect } from "@playwright/test";

test.describe("Frontend Smoke Tests", () => {
  test("portfolio application loads and displays ministry heading", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page).toHaveTitle(/Hitsanat Kifl/);
    await expect(page.getByText("ህፃናት ክፍል — Children's Ministry")).toBeVisible();
    await expect(page.getByText("Welcome to Hitsanat Kifl")).toBeVisible();
  });

  test("admin application loads and displays login page", async ({ page }) => {
    await page.goto("http://localhost:3002");
    await expect(page).toHaveTitle(/Hitsanat Kifl/);
    await expect(page.getByRole("heading", { name: "Hitsanat Kifl" })).toBeVisible();
    await expect(page.getByText("Admin Portal - Sign in to your account")).toBeVisible();
  });
});
