import { Editor } from "grapesjs";
import { initEditor, wrapInSection, getColumnChild, toHtml, parseHtml } from "../../helpers";

describe("mj-table", () => {
  let editor: Editor;

  beforeEach(async () => {
    editor = await initEditor();
  });

  afterEach(() => editor.destroy());

  test("元件存在且 type 正確", () => {
    editor.addComponents(wrapInSection(`<mj-table><tr><td>A</td></tr></mj-table>`));
    const comp = getColumnChild(editor);
    expect(comp).toBeTruthy();
    expect(comp?.get("type")).toBe("mj-table");
  });

  test("style-default 預設值正確", () => {
    editor.addComponents(wrapInSection(`<mj-table><tr><td>A</td></tr></mj-table>`));
    const style = getColumnChild(editor)?.getStyle();
    expect(style?.["color"]).toBe("#000000");
    expect(style?.["font-family"]).toBe("Ubuntu, Helvetica, Arial, sans-serif");
    expect(style?.["font-size"]).toBe("13px");
    expect(style?.["line-height"]).toBe("22px");
    expect(style?.["table-layout"]).toBe("auto");
    expect(style?.["width"]).toBe("100%");
    expect(style?.["border"]).toBe("none");
    expect(style?.["align"]).toBe("left");
  });

  test("padding shorthand 展開正確", () => {
    editor.addComponents(wrapInSection(`<mj-table padding="20px 10px"><tr><td>A</td></tr></mj-table>`));
    const style = getColumnChild(editor)?.getStyle();
    expect(style?.["padding-top"]).toBe("20px");
    expect(style?.["padding-right"]).toBe("10px");
    expect(style?.["padding-bottom"]).toBe("20px");
    expect(style?.["padding-left"]).toBe("10px");
  });

  test("stylable 包含預期屬性", () => {
    editor.addComponents(wrapInSection(`<mj-table><tr><td>A</td></tr></mj-table>`));
    const stylable = getColumnChild(editor)?.get("stylable") as string[];
    expect(stylable).toContain("color");
    expect(stylable).toContain("font-size");
    expect(stylable).toContain("font-family");
    expect(stylable).toContain("line-height");
    expect(stylable).toContain("border");
    expect(stylable).toContain("align");
    expect(stylable).toContain("table-layout");
    expect(stylable).toContain("width");
    expect(stylable).toContain("padding");
  });

  test("align 屬性轉 HTML 為外層 td[align]", () => {
    editor.addComponents(
      wrapInSection(`<mj-table align="center"><tr><td>A</td></tr></mj-table>`)
    );
    const doc = parseHtml(toHtml(editor));
    const td = doc.querySelector("td[align='center']");
    expect(td).not.toBeNull();
  });

  test("font-size 自訂值轉 HTML 正確", () => {
    editor.addComponents(
      wrapInSection(`<mj-table font-size="20px"><tr><td>A</td></tr></mj-table>`)
    );
    const doc = parseHtml(toHtml(editor));
    const table = doc.querySelector("table[style*='font-size:20px']");
    expect(table).not.toBeNull();
  });

  test("color 自訂值轉 HTML 正確", () => {
    editor.addComponents(
      wrapInSection(`<mj-table color="#ff0000"><tr><td>A</td></tr></mj-table>`)
    );
    const doc = parseHtml(toHtml(editor));
    const table = doc.querySelector("table[style*='color:#ff0000']");
    expect(table).not.toBeNull();
  });

  test("border 自訂值轉 HTML 正確", () => {
    editor.addComponents(
      wrapInSection(`<mj-table border="1px solid black"><tr><td>A</td></tr></mj-table>`)
    );
    const doc = parseHtml(toHtml(editor));
    const table = doc.querySelector("table[style*='border:1px solid black']");
    expect(table).not.toBeNull();
  });
});
