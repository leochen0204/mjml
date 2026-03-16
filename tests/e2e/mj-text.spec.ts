import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);
});

test("mj-text 在 canvas 渲染 font-size 和 color 正確", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-text font-size="20px" color="#0000ff">測試標題</mj-text>
      </mj-column></mj-section></mj-body></mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  // mj-text 內容渲染在 tr > td > div
  const el = frame.locator("[data-gjs-type='mj-text'] td > div").first();
  await expect(el).toBeVisible();
  await expect(el).toHaveCSS("font-size", "20px");
  await expect(el).toHaveCSS("color", "rgb(0, 0, 255)");
});

test("mj-text 自訂內容渲染正確", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-text font-size="32px" color="#ff0000">測試文字</mj-text>
      </mj-column></mj-section></mj-body></mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const el = frame.locator("[data-gjs-type='mj-text'] td > div").first();
  await expect(el).toBeVisible();
  await expect(el).toHaveCSS("font-size", "32px");
  await expect(el).toHaveCSS("color", "rgb(255, 0, 0)");
});

test("mj-text 點擊後 pointer-events 啟用（onActive）", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-text>點擊測試</mj-text>
      </mj-column></mj-section></mj-body></mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const inner = frame.locator("[data-gjs-type='mj-text'] td > div").first();
  await expect(inner).toBeVisible();

  await inner.click();
  await expect(inner).toHaveCSS("pointer-events", "all");
});
