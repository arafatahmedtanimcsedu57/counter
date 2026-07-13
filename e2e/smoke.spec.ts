import { test, expect } from "@playwright/test";

test("home page loads and renders the placeholder", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("To get started, edit the page.tsx file."),
  ).toBeVisible();
});
