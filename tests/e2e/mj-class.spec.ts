import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);
});

test("mj-class 定義的 color 和 font-size 套用到目標元件", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-class name="hero" color="#ff0000" font-size="32px" />
          </mj-attributes>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text mj-class="hero">Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const el = frame.locator("[data-gjs-type='mj-text'] td > div").first();
  await expect(el).toBeVisible();
  await expect(el).toHaveCSS("font-size", "32px");
  await expect(el).toHaveCSS("color", "rgb(255, 0, 0)");
});

test("多個 mj-class 各自獨立套用", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-class name="small" font-size="12px" />
            <mj-class name="large" font-size="24px" />
          </mj-attributes>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text mj-class="small">小文字</mj-text>
              <mj-text mj-class="large">大文字</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const texts = frame.locator("[data-gjs-type='mj-text'] td > div");

  await expect(texts.nth(0)).toHaveCSS("font-size", "12px");
  await expect(texts.nth(1)).toHaveCSS("font-size", "24px");
});

test("同一元件套用兩個 mj-class，後者屬性覆蓋前者", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-class name="red" color="#ff0000" />
            <mj-class name="large" font-size="28px" color="#00ff00" />
          </mj-attributes>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text mj-class="red large">Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const el = frame.locator("[data-gjs-type='mj-text'] td > div").first();
  await expect(el).toBeVisible();
  await expect(el).toHaveCSS("color", "rgb(0, 255, 0)");
  await expect(el).toHaveCSS("font-size", "28px");
});

test("元件明確屬性優先於 mj-class", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-class name="styled" color="#ff0000" font-size="20px" />
          </mj-attributes>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text mj-class="styled" color="#0000ff">覆蓋顏色</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `);
  });

  const frame = page.frameLocator(".gjs-frame");
  const el = frame.locator("[data-gjs-type='mj-text'] td > div").first();
  await expect(el).toBeVisible();
  await expect(el).toHaveCSS("color", "rgb(0, 0, 255)");
  await expect(el).toHaveCSS("font-size", "20px");
});
