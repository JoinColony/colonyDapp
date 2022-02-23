import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  await page.goto("http://127.0.0.1:9090/landing");
  const title = page.locator(".LandingPage_title_Gm2zr6oF");
  await expect(title).toHaveText("Welcome, what would you like to do?");
});
