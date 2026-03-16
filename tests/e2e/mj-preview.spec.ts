import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);
});

test("頁面初始載入 template.mjml（含 mj-preview）不造成 crash", async ({ page }) => {
  const errors: string[] = [];
  // 在 goto 前就監聽，才能捕捉初始載入的錯誤
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);

  const typeErrors = errors.filter((e) => e.includes("TypeError"));
  expect(typeErrors).toHaveLength(0);
});

test("mj-preview setComponents 不造成 Editor crash", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml>
        <mj-head>
          <mj-preview>Hello Preview</mj-preview>
        </mj-head>
        <mj-body><mj-section><mj-column>
          <mj-text>Hello</mj-text>
        </mj-column></mj-section></mj-body>
      </mjml>
    `);
  });
  await page.waitForTimeout(500);

  const typeErrors = errors.filter((e) => e.includes("TypeError"));
  expect(typeErrors).toHaveLength(0);
});

test("mj-preview 元件在 canvas 中為隱藏（display:none）", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml>
        <mj-head>
          <mj-preview>Hello Preview</mj-preview>
        </mj-head>
        <mj-body><mj-section><mj-column>
          <mj-text>Hello</mj-text>
        </mj-column></mj-section></mj-body>
      </mjml>
    `);
  });
  await page.waitForTimeout(500);

  const frame = page.frameLocator(".gjs-frame");
  const previewEl = frame.locator("[data-gjs-type='mj-preview']");
  await expect(previewEl).toHaveCSS("display", "none");
});

test("mj-preview rerender 不造成 crash", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  await page.evaluate(() => {
    (window as any).editor.setComponents(`
      <mjml>
        <mj-head>
          <mj-preview>Initial</mj-preview>
        </mj-head>
        <mj-body></mj-body>
      </mjml>
    `);
  });
  await page.waitForTimeout(300);

  // 觸發 rerender：修改屬性
  await page.evaluate(() => {
    const editor = (window as any).editor;
    const mjml = editor.getComponents().at(0);
    const head = mjml?.components().find((c: any) => c.get("type") === "mj-head");
    const preview = head?.components().find((c: any) => c.get("type") === "mj-preview");
    preview?.set("attributes", { "data-test": "1" });
  });
  await page.waitForTimeout(300);

  const typeErrors = errors.filter((e) => e.includes("TypeError"));
  expect(typeErrors).toHaveLength(0);
});
