import { test, expect } from "@playwright/test";

const stats = [
  { url: "http://localhost:3000/users*", total: 12 },
  { url: "http://localhost:3000/subjects*", total: 7 },
  { url: "http://localhost:3000/tests*", total: 5 },
  { url: "http://localhost:3000/questions*", total: 3 },
  { url: "http://localhost:3000/test-sessions*", total: 2 },
];

test.describe("home dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "test-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          username: "admin",
          role: "SUPER_ADMIN",
        }),
      );
    });

    for (const { url, total } of stats) {
      await page.route(url, async (route) => {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            data: [],
            meta: {
              currentPage: 1,
              lastPage: 0,
              perPage: 10,
              total,
            },
          }),
        });
      });
    }
  });

  test("renders the dashboard with mocked stats", async ({ page }) => {
    await page.goto("/home");

    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();

    for (const { label, total } of [
      { label: "Users", total: 12 },
      { label: "Subjects", total: 7 },
      { label: "Tests", total: 5 },
      { label: "Questions", total: 3 },
      { label: "Test Sessions", total: 2 },
    ]) {
      const main = page.getByRole("main");

      await expect(
        main.locator("span.text-sm.font-medium").filter({ hasText: label }),
      ).toBeVisible();

      await expect(
        main.locator("span.text-3xl").getByText(String(total), { exact: true }),
      ).toBeVisible();
    }
  });

  test("shows the quick navigation links", async ({ page }) => {
    await page.goto("/home");

    await expect(page.getByText("Quick Navigation")).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Users Management" }),
    ).toBeVisible();
  });
});
