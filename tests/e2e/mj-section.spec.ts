import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);
});

test("mj-section padding='0' shorthand 展開並渲染到 canvas", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(
      '<mjml><mj-body><mj-section padding="0"><mj-column><mj-text>Test</mj-text></mj-column></mj-section></mj-body></mjml>'
    );
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const td = frame.locator("[data-gjs-type='mj-section'] td").first();

  // padding="0" 應反映在 section 的 td style 上
  await expect(td).toHaveCSS("padding-top", "0px");
  await expect(td).toHaveCSS("padding-right", "0px");
  await expect(td).toHaveCSS("padding-bottom", "0px");
  await expect(td).toHaveCSS("padding-left", "0px");
});

test("mj-section border 渲染到 canvas", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(
      '<mjml><mj-body><mj-section border="2px solid #ff0000"><mj-column><mj-text>Test</mj-text></mj-column></mj-section></mj-body></mjml>'
    );
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");

  // section 層的 td 應該有 border
  const sectionTd = frame.locator(
    "[data-gjs-type='mj-section'] > div > div > table > tbody > tr > td"
  ).first();
  await expect(sectionTd).toHaveCSS("border-top-width", "2px");
  await expect(sectionTd).toHaveCSS("border-top-style", "solid");
  await expect(sectionTd).toHaveCSS("border-top-color", "rgb(255, 0, 0)");

  // mj-text 那層的 td 不應該有 border
  const textTd = frame.locator("[data-gjs-type='mj-text'] td").first();
  await expect(textTd).not.toHaveCSS("border-top-width", "2px");
});
