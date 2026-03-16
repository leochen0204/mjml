import { test, expect } from "@playwright/test";

// ground truth 來自 mjml-cli 輸出：
// mj-attributes 設定 font-size/color 後，差異出現在 mj-text 的 td > div

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);
});

test("mj-style css-class 套用到 canvas", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml>
        <mj-head>
          <mj-style>.custom { color: #ff0000; }</mj-style>
        </mj-head>
        <mj-body><mj-section><mj-column>
          <mj-text css-class="custom">Hello</mj-text>
        </mj-column></mj-section></mj-body>
      </mjml>
    `);
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");

  // 等 td.custom 出現後再取 style
  await frame.locator("td.custom").waitFor();
  const frames = page.frames();
  const canvasFrame = frames[frames.length - 1];
  const styleContent = await canvasFrame!.evaluate(() =>
    Array.from(document.querySelectorAll("style"))
      .map((el) => el.textContent)
      .join("")
  );
  expect(styleContent).toContain(".custom");
  expect(styleContent).toContain("color: #ff0000");

  // class 套在 td 上，computed style 正確
  const td = frame.locator("td.custom").first();
  await expect(td).toBeVisible();
  await expect(td).toHaveCSS("color", "rgb(255, 0, 0)");
});

test("mj-attributes mj-text 全域 font-size/color 渲染到 canvas", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-text font-size="32px" color="#ff0000" />
          </mj-attributes>
        </mj-head>
        <mj-body><mj-section><mj-column>
          <mj-text>Hello</mj-text>
        </mj-column></mj-section></mj-body>
      </mjml>
    `);
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const el = frame.locator("[data-gjs-type='mj-text'] td > div").first();

  // 與無 mj-attributes 的預設值（font-size:13px, color:#000000）比較
  await expect(el).toHaveCSS("font-size", "32px");
  await expect(el).toHaveCSS("color", "rgb(255, 0, 0)");
});
