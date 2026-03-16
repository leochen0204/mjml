import { Editor } from "grapesjs";
import { initEditor, wrapInHead, getHeadChild, toHtml, parseHtml } from "../../helpers";

describe("mj-preview", () => {
  let editor: Editor;

  beforeEach(async () => {
    editor = await initEditor();
  });

  afterEach(() => editor.destroy());

  test("元件存在且 type 正確", () => {
    editor.addComponents(wrapInHead(`<mj-preview>Hello Preview</mj-preview>`));
    const comp = getHeadChild(editor);
    expect(comp).toBeTruthy();
    expect(comp?.get("type")).toBe("mj-preview");
  });

  test("void 為 false（可含內容）", () => {
    editor.addComponents(wrapInHead(`<mj-preview>Hello Preview</mj-preview>`));
    const comp = getHeadChild(editor);
    expect(comp?.get("void")).toBe(false);
  });

  test("draggable 限制在 mj-head", () => {
    editor.addComponents(wrapInHead(`<mj-preview>Hello Preview</mj-preview>`));
    const comp = getHeadChild(editor);
    const draggable = comp?.get("draggable");
    expect(typeof draggable).toBe("string");
    expect(draggable).toContain("mj-head");
  });

  test("HTML 輸出含有隱藏的 preview div", () => {
    editor.addComponents(wrapInHead(`<mj-preview>Hello Preview</mj-preview>`));
    const doc = parseHtml(toHtml(editor));
    const el = doc.querySelector("div[style*='display:none']");
    expect(el).not.toBeNull();
    expect(el?.textContent).toBe("Hello Preview");
  });

  test("preview 文字正確輸出到 HTML", () => {
    editor.addComponents(wrapInHead(`<mj-preview>My Email Preview</mj-preview>`));
    const html = toHtml(editor);
    expect(html).toContain("My Email Preview");
  });

  test("render 不 crash（addComponents 後不拋例外）", () => {
    expect(() => {
      editor.addComponents(wrapInHead(`<mj-preview>Test</mj-preview>`));
    }).not.toThrow();
  });

  test("rerender 不 crash（修改內容後不拋例外）", () => {
    editor.addComponents(wrapInHead(`<mj-preview>Initial</mj-preview>`));
    const comp = getHeadChild(editor);
    expect(() => {
      comp?.components().reset([{ type: "text", content: "Updated" }]);
    }).not.toThrow();
  });
});
