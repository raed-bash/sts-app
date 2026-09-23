import { test, expect } from "@playwright/test";

test.describe("authentication", () => {
  test("redirects unauthenticated visitors to the login page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("renders the login form", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Welcome Back" }),
    ).toBeVisible();

    await expect(page.locator('input[name="username"]')).toBeVisible();

    await expect(page.locator('input[name="password"]')).toBeVisible();

    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("keeps an authenticated user on the auth pages redirected to home", async ({
    page,
  }) => {
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

    await page.goto("/login");

    await expect(page).toHaveURL(/\/home$/);
  });
});
