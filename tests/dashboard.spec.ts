import { expect, test } from "@playwright/test";

test("switches modules and exposes range pricing", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "装备属性库" })).toBeVisible();
  await expect(page.getByText("本程序由股神开发")).toBeVisible();
  await page.getByRole("button", { name: /装备物价表/ }).click();
  await expect(page.getByText("一区物价表 · 2026.8")).toBeVisible();
  await expect(page.getByRole("heading", { name: "属性区间价格" })).toBeVisible();
  await expect(page.getByText("9000+ 点券")).toBeVisible();
});

test("browses added equipment attributes and critical-damage prices", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /魂导器 41/ }).click();
  await expect(page.getByText("蛇年大吉")).toBeVisible();
  await page.getByRole("button", { name: /魂骨 57/ }).click();
  await expect(page.getByText("帝天头骨")).toBeVisible();
  await page.getByRole("button", { name: /徽章 23/ }).click();
  await expect(page.getByText("魔法深渊之章")).toBeVisible();

  await page.getByRole("button", { name: /装备物价表/ }).click();
  await page.getByRole("combobox", { name: "分类" }).selectOption("徽章");
  await expect(page.getByRole("table", { name: "徽章爆伤点券价格" })).toBeVisible();
  await page.getByRole("combobox", { name: "分类" }).selectOption("魂导器");
  const table = page.getByRole("table", { name: "魂导器爆伤点券价格" });
  await expect(table).toContainText("三孔");
  await expect(table).toContainText("四孔");
  await expect(table).toContainText("五孔");
  await expect(table).not.toContainText("一孔");
  await expect(table).not.toContainText("二孔");
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
  await page.getByRole("button", { name: /装备物价表/ }).click();
  await page.getByRole("combobox", { name: "分类" }).selectOption("魂导器");
  const marketDimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(marketDimensions.width).toBeLessThanOrEqual(marketDimensions.viewport);
});
