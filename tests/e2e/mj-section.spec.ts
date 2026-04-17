import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForFunction(() => !!(window as any).editor?.getComponents);
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
    "[data-gjs-type='mj-section'] > div > table > tbody > tr > td"
  ).first();
  await expect(sectionTd).toHaveCSS("border-top-width", "2px");
  await expect(sectionTd).toHaveCSS("border-top-style", "solid");
  await expect(sectionTd).toHaveCSS("border-top-color", "rgb(255, 0, 0)");

  // mj-text 那層的 td 不應該有 border
  const textTd = frame.locator("[data-gjs-type='mj-text'] td").first();
  await expect(textTd).not.toHaveCSS("border-top-width", "2px");
});

test("multi-column 在 canvas 中各自保持正確寬度比例", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(
      `<mjml><mj-body><mj-section><mj-column width="66.66666666666666%"><mj-text>A</mj-text></mj-column><mj-column width="33.33333333333333%"><mj-text>B</mj-text></mj-column></mj-section></mj-body></mjml>`
    );
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const columns = frame.locator("[data-gjs-type='mj-column']");

  const col1Width = await columns.nth(0).evaluate(el => el.getBoundingClientRect().width);
  const col2Width = await columns.nth(1).evaluate(el => el.getBoundingClientRect().width);
  const total = col1Width + col2Width;

  // col1 應約佔 66.66%，col2 約佔 33.33%
  expect(col1Width / total).toBeCloseTo(0.6667, 2);
  expect(col2Width / total).toBeCloseTo(0.3333, 2);
});

test("full-width section + multi-column 在 canvas 中保持正確寬度比例", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(
      `<mjml><mj-body background-color="#d7dde5"><mj-section full-width="full-width"><mj-column width="66.66666666666666%" vertical-align="middle"><mj-text>A</mj-text></mj-column><mj-column width="33.33333333333333%" vertical-align="middle"><mj-text>B</mj-text></mj-column></mj-section></mj-body></mjml>`
    );
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const columns = frame.locator("[data-gjs-type='mj-column']");

  const col1Width = await columns.nth(0).evaluate(el => el.getBoundingClientRect().width);
  const col2Width = await columns.nth(1).evaluate(el => el.getBoundingClientRect().width);
  const total = col1Width + col2Width;

  expect(col1Width / total).toBeCloseTo(0.6667, 2);
  expect(col2Width / total).toBeCloseTo(0.3333, 2);
});

test("column vertical-align='middle' 套用到 canvas", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(
      `<mjml><mj-body><mj-section><mj-column width="50%" vertical-align="middle"><mj-text>A</mj-text></mj-column><mj-column width="50%" vertical-align="middle"><mj-text>B</mj-text></mj-column></mj-section></mj-body></mjml>`
    );
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const columns = frame.locator("[data-gjs-type='mj-column']");

  await expect(columns.nth(0)).toHaveCSS("vertical-align", "middle");
  await expect(columns.nth(1)).toHaveCSS("vertical-align", "middle");
});

test("column 全部 vertical-align='middle' 且高度不同時，中點仍對齊", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(
      `<mjml><mj-body><mj-section><mj-column width="50%" vertical-align="middle"><mj-text>短</mj-text></mj-column><mj-column width="50%" vertical-align="middle"><mj-text>長<br/>長<br/>長<br/>長</mj-text></mj-column></mj-section></mj-body></mjml>`
    );
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const columns = frame.locator("[data-gjs-type='mj-column']");

  const col1Mid = await columns.nth(0).evaluate(el => {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  });
  const col2Mid = await columns.nth(1).evaluate(el => {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  });

  // 全部設定 middle 時，中點應對齊（允許 2px 誤差）
  expect(Math.abs(col1Mid - col2Mid)).toBeLessThan(2);
});

// MJML 官方文件說明：vertical-align="middle" 只有在所有 mj-column 都設定時才有效
// https://documentation.mjml.io/#mj-column
test("column 混用 vertical-align top/middle 時中點不對齊（符合 MJML 規格）", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(
      `<mjml><mj-body><mj-section><mj-column width="50%" vertical-align="top"><mj-text>短</mj-text></mj-column><mj-column width="50%" vertical-align="middle"><mj-text>長<br/>長<br/>長<br/>長</mj-text></mj-column></mj-section></mj-body></mjml>`
    );
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const columns = frame.locator("[data-gjs-type='mj-column']");

  const col1Mid = await columns.nth(0).evaluate(el => {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  });
  const col2Mid = await columns.nth(1).evaluate(el => {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  });

  // 混用 top/middle 中點會偏移，這是預期行為
  expect(Math.abs(col1Mid - col2Mid)).toBeGreaterThan(2);
});

test("等寬三欄（不設 width）在 canvas 中並排顯示", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(
      `<mjml><mj-body><mj-section>
        <mj-column><mj-text>A</mj-text></mj-column>
        <mj-column><mj-text>B</mj-text></mj-column>
        <mj-column><mj-text>C</mj-text></mj-column>
      </mj-section></mj-body></mjml>`
    );
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const columns = frame.locator("[data-gjs-type='mj-column']");

  const col1Width = await columns.nth(0).evaluate(el => el.getBoundingClientRect().width);
  const col2Width = await columns.nth(1).evaluate(el => el.getBoundingClientRect().width);
  const col3Width = await columns.nth(2).evaluate(el => el.getBoundingClientRect().width);
  const total = col1Width + col2Width + col3Width;

  // 三欄等寬，各佔約 33.33%
  expect(col1Width / total).toBeCloseTo(0.3333, 2);
  expect(col2Width / total).toBeCloseTo(0.3333, 2);
  expect(col3Width / total).toBeCloseTo(0.3333, 2);
});

test("column 未設定 vertical-align 預設為 top", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(
      `<mjml><mj-body><mj-section><mj-column><mj-text>A</mj-text></mj-column><mj-column><mj-text>B</mj-text></mj-column></mj-section></mj-body></mjml>`
    );
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const columns = frame.locator("[data-gjs-type='mj-column']");

  await expect(columns.nth(0)).toHaveCSS("vertical-align", "top");
  await expect(columns.nth(1)).toHaveCSS("vertical-align", "top");
});
