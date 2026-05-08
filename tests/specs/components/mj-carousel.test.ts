import { Editor } from "grapesjs";
import { initEditor, wrapInSection, getColumnChild, toHtml, parseHtml } from "../../helpers";

describe("mj-carousel", () => {
  let editor: Editor;

  beforeEach(async () => {
    editor = await initEditor();
  });

  afterEach(() => editor.destroy());

  const carousel = (carouselAttrs = "", imageAttrs = "") =>
    wrapInSection(`
      <mj-carousel ${carouselAttrs}>
        <mj-carousel-image src="https://placehold.co/300x200" ${imageAttrs}/>
        <mj-carousel-image src="https://placehold.co/300x200/f9c74f/fff"/>
      </mj-carousel>
    `);

  // ── Model ──────────────────────────────────────────────────────────────────

  test("元件存在且 type 正確", () => {
    editor.addComponents(carousel());
    expect(getColumnChild(editor)?.get("type")).toBe("mj-carousel");
  });

  test("style-default 預設值正確", () => {
    editor.addComponents(carousel());
    const style = getColumnChild(editor)?.getStyle();
    expect(style?.["align"]).toBe("center");
    expect(style?.["border-radius"]).toBe("6px");
    expect(style?.["tb-border"]).toBe("2px solid transparent");
    expect(style?.["tb-border-radius"]).toBe("6px");
    expect(style?.["tb-width"]).toBe("110px");
    expect(style?.["icon-width"]).toBe("44px");
    expect(style?.["tb-hover-border-color"]).toBe("#fead0d");
    expect(style?.["tb-selected-border-color"]).toBe("#ccc");
    expect(style?.["thumbnails"]).toBe("hidden");
  });

  test("stylable 包含 align 和 border-radius", () => {
    editor.addComponents(carousel());
    const stylable = getColumnChild(editor)?.get("stylable") as string[];
    expect(stylable).toContain("align");
    expect(stylable).toContain("border-radius");
  });

  test("traits 包含 align、left-icon、right-icon", () => {
    editor.addComponents(carousel());
    const traits = getColumnChild(editor)?.get("traits") as unknown as any[];
    const names = traits.map((t: any) => t.get("name"));
    expect(names).toContain("align");
    expect(names).toContain("left-icon");
    expect(names).toContain("right-icon");
  });

  test("包含兩個 mj-carousel-image 子元件", () => {
    editor.addComponents(carousel());
    const children = getColumnChild(editor)?.components();
    expect(children?.length).toBe(2);
    expect(children?.at(0)?.get("type")).toBe("mj-carousel-image");
    expect(children?.at(1)?.get("type")).toBe("mj-carousel-image");
  });

  // ── MJML HTML 輸出 ─────────────────────────────────────────────────────────

  test("預設 align=center 輸出 td[align='center']", () => {
    editor.addComponents(carousel());
    const doc = parseHtml(toHtml(editor));
    expect(doc.querySelector("td[align='center']")).not.toBeNull();
  });

  test("align=left 輸出 td[align='left']", () => {
    editor.addComponents(carousel('align="left"'));
    const doc = parseHtml(toHtml(editor));
    expect(doc.querySelector("td[align='left']")).not.toBeNull();
  });

  test("carousel-image src 出現在 HTML 輸出", () => {
    editor.addComponents(carousel());
    expect(toHtml(editor)).toContain("placehold.co/300x200");
  });

  test("carousel-image href 轉 HTML 包含 <a> 連結", () => {
    editor.addComponents(carousel("", 'href="https://example.com"'));
    const doc = parseHtml(toHtml(editor));
    expect(doc.querySelector(".mj-carousel-image a[href='https://example.com']")).not.toBeNull();
  });

  test("carousel-image alt 出現在 img[alt]", () => {
    editor.addComponents(carousel("", 'alt="test alt"'));
    const doc = parseHtml(toHtml(editor));
    expect(doc.querySelector(".mj-carousel-image img[alt='test alt']")).not.toBeNull();
  });

  test("carousel-image border-radius=0px 反映在 img style", () => {
    editor.addComponents(carousel("", 'border-radius="0px"'));
    const doc = parseHtml(toHtml(editor));
    expect(doc.querySelector(".mj-carousel-image img[style*='border-radius:0px']")).not.toBeNull();
  });
});
