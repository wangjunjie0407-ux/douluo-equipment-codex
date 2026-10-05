import { expect, test } from "@playwright/test";

test("switches modules and exposes range pricing", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "魂环资料库" })).toBeVisible();
  await page.getByRole("button", { name: /装备物价表/ }).click();
  await expect(page.getByText("一区物价表 · 2026.8")).toBeVisible();
  await expect(page.getByRole("heading", { name: "属性区间价格" })).toBeVisible();
  await expect(page.getByText("9000+ 点券")).toBeVisible();
});

test("searches and clears an empty result", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("搜索魂环").fill("不存在的魂环");
  await expect(page.getByText("没有找到匹配的魂环")).toBeVisible();
  await page.getByRole("button", { name: "清除筛选" }).click();
  await expect(page.getByText("没有找到匹配的魂环")).toBeHidden();
});

test("keeps the mobile page within the viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.locator("link[rel='icon']")).toHaveCount(1);
});
