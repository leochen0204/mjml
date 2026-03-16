import { Editor } from "grapesjs";
import { initEditor, wrapInSection, getColumnChild, toHtml, parseHtml } from "../../helpers";

describe("mj-text", () => {
  let editor: Editor;

  beforeEach(async () => {
    editor = await initEditor();
  });

  afterEach(() => editor.destroy());

  test("元件存在且 type 正確", () => {
    editor.addComponents(wrapInSection(`<mj-text>Hello</mj-text>`));
    const comp = getColumnChild(editor);
    expect(comp).toBeTruthy();
  });

  test("預設 style 正確", () => {
    editor.addComponents(wrapInSection(`<mj-text>Hello</mj-text>`));
    const style = getColumnChild(editor)?.getStyle();
    expect(style?.["font-size"]).toBe("13px");
    expect(style?.["align"]).toBe("left");
    expect(style?.["padding-top"]).toBe("10px");
    expect(style?.["padding-bottom"]).toBe("10px");
    expect(style?.["padding-right"]).toBe("25px");
    expect(style?.["padding-left"]).toBe("25px");
  });

  test("自訂屬性轉 HTML 正確", () => {
    editor.addComponents(
      wrapInSection(`<mj-text font-size="20px" color="#ff0000">Test</mj-text>`)
    );
    const doc = parseHtml(toHtml(editor));
    const el = doc.querySelector("div[style*='font-size:20px']");
    expect(el).not.toBeNull();
    expect(el).toHaveStyle({ "font-size": "20px", color: "#ff0000" });
    expect(el).toHaveTextContent("Test");
  });

  test("padding shorthand 展開", () => {
    editor.addComponents(
      wrapInSection(`<mj-text padding="20px 10px">Hello</mj-text>`)
    );
    const style = getColumnChild(editor)?.getStyle();
    expect(style?.["padding-top"]).toBe("20px");
    expect(style?.["padding-right"]).toBe("10px");
    expect(style?.["padding-bottom"]).toBe("20px");
    expect(style?.["padding-left"]).toBe("10px");
  });
});
