import { Editor } from "grapesjs";
import { initEditor, wrapInSection, getColumnChild, toHtml, parseHtml } from "../../helpers";

describe("mj-image", () => {
  let editor: Editor;

  beforeEach(async () => {
    editor = await initEditor();
  });

  afterEach(() => editor.destroy());

  const SRC = "https://example.com/img.png";

  test("style-default 預設值正確", () => {
    editor.addComponents(wrapInSection(`<mj-image src="${SRC}"></mj-image>`));
    const style = getColumnChild(editor)?.getStyle();
    expect(style?.["align"]).toBe("center");
    expect(style?.["padding-top"]).toBe("10px");
    expect(style?.["padding-bottom"]).toBe("10px");
    expect(style?.["padding-right"]).toBe("25px");
    expect(style?.["padding-left"]).toBe("25px");
  });

  test("stylable 包含 align、width、border-radius", () => {
    editor.addComponents(wrapInSection(`<mj-image src="${SRC}"></mj-image>`));
    const stylable = getColumnChild(editor)?.get("stylable") as string[];
    expect(stylable).toContain("align");
    expect(stylable).toContain("width");
    expect(stylable).toContain("border-radius");
  });

  test("traits 包含 src、href、alt", () => {
    editor.addComponents(wrapInSection(`<mj-image src="${SRC}"></mj-image>`));
    const traits = getColumnChild(editor)?.get("traits") as unknown as any[];
    const names = traits?.map((t: any) => t.get("name")) ?? [];
    expect(names).toContain("src");
    expect(names).toContain("href");
    expect(names).toContain("alt");
  });

  test("align right 轉 HTML 為 td[align='right']", () => {
    editor.addComponents(
      wrapInSection(`<mj-image src="${SRC}" align="right"></mj-image>`)
    );
    const doc = parseHtml(toHtml(editor));
    const td = doc.querySelector("td[align='right']");
    expect(td).not.toBeNull();
  });

  test("width 轉 HTML 反映在 img width 屬性", () => {
    editor.addComponents(
      wrapInSection(`<mj-image src="${SRC}" width="200px"></mj-image>`)
    );
    const doc = parseHtml(toHtml(editor));
    const img = doc.querySelector("img[width='200']");
    expect(img).not.toBeNull();
  });

  test("border-radius 轉 HTML 反映在 img style", () => {
    editor.addComponents(
      wrapInSection(`<mj-image src="${SRC}" border-radius="8px"></mj-image>`)
    );
    const doc = parseHtml(toHtml(editor));
    const img = doc.querySelector("img[style*='border-radius:8px']");
    expect(img).not.toBeNull();
  });
});
