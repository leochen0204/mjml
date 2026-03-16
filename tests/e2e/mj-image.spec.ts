import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);
});

const SRC = "https://example.com/img.png";

test("mj-image 預設 align 渲染為 td[align='center']", async ({ page }) => {
  await page.evaluate((src) => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-image src="${src}"></mj-image>
      </mj-column></mj-section></mj-body></mjml>
    `);
  }, SRC);

  const frame = page.frameLocator(".gjs-frame");
  const td = frame.locator("[data-gjs-type='mj-image'] td[align='center']");
  await expect(td).toBeVisible();
});

test("mj-image align right 渲染為 td[align='right']", async ({ page }) => {
  await page.evaluate((src) => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-image src="${src}" align="right"></mj-image>
      </mj-column></mj-section></mj-body></mjml>
    `);
  }, SRC);

  const frame = page.frameLocator(".gjs-frame");
  const td = frame.locator("[data-gjs-type='mj-image'] td[align='right']");
  await expect(td).toBeVisible();
});

test("mj-image border-radius 渲染在 img style", async ({ page }) => {
  await page.evaluate((src) => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-image src="${src}" border-radius="8px"></mj-image>
      </mj-column></mj-section></mj-body></mjml>
    `);
  }, SRC);

  const frame = page.frameLocator(".gjs-frame");
  const img = frame.locator("[data-gjs-type='mj-image'] img");
  await expect(img).toHaveCSS("border-radius", "8px");
});
