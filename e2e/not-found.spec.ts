import { test, expect } from "@playwright/test";

test.describe("404 not found", () => {
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
  });

  test("renders a 404 page for unknown routes", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");

    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();

    await expect(page.getByText("404")).toBeVisible();
  });
});
