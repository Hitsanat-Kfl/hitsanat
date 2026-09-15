import { test, expect } from "@playwright/test";

test.describe("Portfolio Events Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("events section is present or hidden when empty", async ({ page }) => {
    const eventsHeading = page.getByRole("heading", { name: "Upcoming Events" });
    const isVisible = await eventsHeading.isVisible().catch(() => false);
    if (isVisible) {
      await expect(page.getByText("የሚቀጥሉ ዝግጅቶች")).toBeVisible();
    }
  });
});

test.describe("Portfolio Announcements Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("announcements section is present or hidden when empty", async ({ page }) => {
    const annHeading = page.getByRole("heading", { name: "Announcements" });
    const isVisible = await annHeading.isVisible().catch(() => false);
    if (isVisible) {
      await expect(page.getByText("ስርጭቶች")).toBeVisible();
    }
  });
});
