import { test, expect } from "playwright/test";
import type { Page } from "playwright/test";
import { randomUUID } from "node:crypto";
import { numericPrice } from "../lib/format";

async function noPageOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
}

test("home, hero anchor, counts, ticker and responsive layout", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "আজকের বাজারের দাম এক নজরে" })).toBeVisible();
  await expect(page.locator("#সব-পণ্য .product-card")).toHaveCount(33);
  await expect(page.locator("section[aria-labelledby=risers] .product-card")).toHaveCount(6);
  await expect(page.locator("section[aria-labelledby=fallers] .product-card")).toHaveCount(6);
  await expect(page.locator(".hero-image img")).toBeVisible();
  await page.getByRole("link", { name: /সব পণ্যের দাম দেখুন/ }).click();
  await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe("#সব-পণ্য");
  await page.getByRole("button", { name: "দামের তালিকা থামান" }).click();
  await expect(page.locator(".ticker")).toHaveClass(/paused/);
  await noPageOverflow(page);
  await page.screenshot({ path: info.outputPath("home.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("category sorting, active navigation and direct refresh", async ({ page }) => {
  await page.goto("/category/chal");
  await expect(page.locator("main .product-card")).toHaveCount(4);
  await expect(page.locator('nav a[href="/category/chal"]')).toHaveAttribute("aria-current", "page");
  const prices = async () => (await page.locator("main .price strong").allTextContents()).map(numericPrice);
  const original = await prices();
  await page.getByRole("combobox").selectOption("asc");
  await expect.poll(prices).toEqual([66, 74, 99, 148]);
  await page.getByRole("combobox").selectOption("desc");
  await expect.poll(prices).toEqual([148, 99, 74, 66]);
  await page.getByRole("combobox").selectOption("default");
  await expect.poll(prices).toEqual(original);
  await page.reload();
  await expect(page.locator("main .product-card")).toHaveCount(4);
  await noPageOverflow(page);
});

test("home search handles a match and no results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("মিনিকেট");
  await expect(page.locator("#সব-পণ্য .product-card")).toHaveCount(1);
  await page.getByRole("searchbox").fill("no-such-product-123");
  await expect(page.getByRole("heading", { name: "কোনো পণ্য পাওয়া যায়নি" })).toBeVisible();
});

for (const path of ["/missing-page", "/category/invalid", "/product/unknown"]) {
  test(`friendly invalid route: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "এই পণ্য বা পেজটি খুঁজে পাওয়া যাচ্ছে না" })).toBeVisible();
    await page.getByRole("link", { name: "হোম পেজে ফিরে যান", exact: true }).click();
    await expect(page).toHaveURL("/");
  });
}

test("protected pages reject absent and forged sessions", async ({ page, context }) => {
  await page.goto("/product/miniket-chal");
  await expect(page).toHaveURL(/\/signin\?reason=protected/);
  await expect(page.getByText("বিস্তারিত দেখতে আগে সাইন ইন করুন।", { exact: true })).toBeVisible();
  await context.addCookies([{ name: "better-auth.session_token", value: "forged-session", domain: "localhost", path: "/" }]);
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/signin\?reason=protected/);
});

test("validation feedback and unavailable OAuth state", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("button", { name: "সাইন আপ", exact: true }).click();
  await expect(page.locator(".form-error")).toHaveText("নাম ২ থেকে ১০০ অক্ষরের মধ্যে লিখুন।");
  await page.getByRole("button", { name: "Google দিয়ে চালিয়ে যান" }).click();
  await expect(page.locator(".form-error")).toContainText("দিয়ে সাইন ইন এখন চালু নেই");
});

test("real MongoDB signup, signin, details, name persistence and logout", async ({ page }, info) => {
  const email = `e2e-${randomUUID()}@example.com`, password = `T-${randomUUID()}-8`;
  await page.goto("/signup");
  await page.getByLabel("নাম", { exact: true }).fill("পরীক্ষা ব্যবহারকারী");
  await page.getByLabel("ইমেইল", { exact: true }).fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "সাইন আপ", exact: true }).click();
  await expect(page).toHaveURL("/signin");
  await page.getByLabel("ইমেইল", { exact: true }).fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "সাইন ইন", exact: true }).click();
  await expect(page).toHaveURL("/");
  await expect(page.locator(".user-menu")).toBeVisible();
  await page.goto("/product/sorno-machi-chal");
  await expect(page.locator("tbody tr")).toHaveCount(12);
  await expect(page.locator(".stat-value").nth(0)).toContainText("১৩২");
  await expect(page.locator(".stat-value").nth(1)).toContainText("১৬৫");
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(12);
  await noPageOverflow(page);
  await page.screenshot({ path: info.outputPath("product-details.png"), fullPage: true });
  await page.goto("/profile");
  await page.getByRole("link", { name: "তথ্য আপডেট করুন", exact: true }).click();
  await expect(page).toHaveURL("/profile/update");
  await page.getByLabel("নাম", { exact: true }).fill("আপডেট করা নাম");
  await page.getByRole("button", { name: "তথ্য আপডেট করুন" }).click();
  await expect(page).toHaveURL("/profile");
  await page.reload();
  await expect(page.locator(".profile-card dd").first()).toHaveText("আপডেট করা নাম");
  await page.locator(".user-menu summary").click();
  await page.getByRole("button", { name: /সাইন আউট/ }).click();
  await expect(page).toHaveURL("/");
  await page.goto("/profile/update");
  await expect(page).toHaveURL(/\/signin\?reason=protected/);
});


test("language switch persists across refresh and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "bn");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Today's market prices at a glance" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "English", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.goto("/category/chal");
  await expect(page.getByRole("heading", { name: /Rice/ })).toBeVisible();
  await page.goto("/signin");
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "বাংলা", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "bn");
  await expect(page.getByRole("heading", { name: "সাইন ইন করুন" })).toBeVisible();
});
