import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);
});

test("mj-button 預設 vertical-align 渲染為 td[valign='middle']", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-button>Click</mj-button>
      </mj-column></mj-section></mj-body></mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const td = frame.locator("[data-gjs-type='mj-button'] td[valign='middle']");
  await expect(td).toBeVisible();
});

test("mj-button vertical-align top 渲染為 td[valign='top']", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-button vertical-align="top">Click</mj-button>
      </mj-column></mj-section></mj-body></mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const td = frame.locator("[data-gjs-type='mj-button'] td[valign='top']");
  await expect(td).toBeVisible();
});
