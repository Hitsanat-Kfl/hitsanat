import { test, expect } from "@playwright/test";

const subDepts = [
  { slug: "timihrt", name: "Timihrt", nameAm: "ትምህርት" },
  { slug: "mezmur", name: "Mezmur", nameAm: "መዝሙር" },
  { slug: "kutitr", name: "Kutitr", nameAm: "ቁጥጥር" },
  { slug: "ekd", name: "Ekd", nameAm: "እቅድ" },
];

for (const dept of subDepts) {
  test.describe(`Sub-Department Page: ${dept.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/programs/${dept.slug}`);
    });

    test("renders the department name", async ({ page }) => {
      await expect(page.getByRole("heading", { name: dept.name, exact: true })).toBeVisible();
    });

    test("renders the Amharic name", async ({ page }) => {
      await expect(page.getByText(dept.nameAm)).toBeVisible();
    });

    test("renders About section", async ({ page }) => {
      await expect(page.getByText(`About ${dept.name}`)).toBeVisible();
    });

    test("has header navigation", async ({ page }) => {
      await expect(page.getByRole("heading", { name: "Hitsanat Kifl", exact: true }).first()).toBeVisible();
    });

    test("has footer", async ({ page }) => {
      await expect(page.getByText("Hitsanat Kifl — Children's Ministry")).toBeVisible();
    });

    test("has no accessibility violations", async ({ page }) => {
      const AxeBuilder = (await import("@axe-core/playwright")).default;
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  });
}
