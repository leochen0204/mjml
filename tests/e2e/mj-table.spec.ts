import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);
});

test("mj-table 預設渲染：font-size 13px、color #000000", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-table><tr><td>Cell</td></tr></mj-table>
      </mj-column></mj-section></mj-body></mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  // inner table 含有實際樣式
  const table = frame.locator("[data-gjs-type='mj-table'] table").first();
  await expect(table).toBeVisible();
  await expect(table).toHaveCSS("font-size", "13px");
  await expect(table).toHaveCSS("color", "rgb(0, 0, 0)");
});

test("mj-table 自訂 font-size 和 color 渲染正確", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-table font-size="18px" color="#0000ff"><tr><td>Cell</td></tr></mj-table>
      </mj-column></mj-section></mj-body></mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const table = frame.locator("[data-gjs-type='mj-table'] table").first();
  await expect(table).toBeVisible();
  await expect(table).toHaveCSS("font-size", "18px");
  await expect(table).toHaveCSS("color", "rgb(0, 0, 255)");
});

test("mj-table 自訂 border 渲染正確", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-table border="2px solid red"><tr><td>Cell</td></tr></mj-table>
      </mj-column></mj-section></mj-body></mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const table = frame.locator("[data-gjs-type='mj-table'] table").first();
  await expect(table).toBeVisible();
  await expect(table).toHaveCSS("border-top-color", "rgb(255, 0, 0)");
  await expect(table).toHaveCSS("border-top-width", "2px");
  await expect(table).toHaveCSS("border-top-style", "solid");
});

test("mj-table table-layout 渲染正確", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml><mj-body><mj-section><mj-column>
        <mj-table table-layout="fixed"><tr><td>Cell</td></tr></mj-table>
      </mj-column></mj-section></mj-body></mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const table = frame.locator("[data-gjs-type='mj-table'] table").first();
  await expect(table).toBeVisible();
  await expect(table).toHaveCSS("table-layout", "fixed");
});
