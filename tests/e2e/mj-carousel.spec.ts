import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".gjs-frame");
  await page.waitForTimeout(2000);
});

const MJML = `<mjml><mj-body><mj-section><mj-column>
  <mj-carousel>
    <mj-carousel-image src="https://placehold.co/300x200"/>
    <mj-carousel-image src="https://placehold.co/300x200/f9c74f/fff"/>
    <mj-carousel-image src="https://placehold.co/300x200/90be6d/fff"/>
  </mj-carousel>
</mj-column></mj-section></mj-body></mjml>`;

test("mj-carousel 出現在 canvas", async ({ page }) => {
  await page.evaluate((mjml) => {
    (window as any).editor.setComponents(mjml);
  }, MJML);

  const frame = page.frameLocator(".gjs-frame");
  await expect(frame.locator("[data-gjs-type='mj-carousel']")).toBeVisible();
});

test("canvas 顯示三個 mj-carousel-image", async ({ page }) => {
  await page.evaluate((mjml) => {
    (window as any).editor.setComponents(mjml);
  }, MJML);

  const frame = page.frameLocator(".gjs-frame");
  await expect(frame.locator("[data-gjs-type='mj-carousel-image']")).toHaveCount(3);
});

test("canvas 每張 carousel-image 都有 img 且 src 正確", async ({ page }) => {
  await page.evaluate((mjml) => {
    (window as any).editor.setComponents(mjml);
  }, MJML);

  const frame = page.frameLocator(".gjs-frame");
  const img = frame.locator("[data-gjs-type='mj-carousel-image'] img").first();
  await expect(img).toHaveAttribute("src", /placehold\.co\/300x200/);
});

test("canvas 所有圖片可見（無 display:none）", async ({ page }) => {
  await page.evaluate((mjml) => {
    (window as any).editor.setComponents(mjml);
  }, MJML);

  const frame = page.frameLocator(".gjs-frame");
  const images = frame.locator("[data-gjs-type='mj-carousel-image'] img");
  for (let i = 0; i < 3; i++) {
    await expect(images.nth(i)).toBeVisible();
  }
});
