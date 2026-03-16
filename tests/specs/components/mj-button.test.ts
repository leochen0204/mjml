import { Editor } from "grapesjs";
import { initEditor, wrapInSection, getColumnChild, toHtml, parseHtml } from "../../helpers";

describe("mj-button", () => {
  let editor: Editor;

  beforeEach(async () => {
    editor = await initEditor();
  });

  afterEach(() => editor.destroy());

  test("style-default 預設值正確", () => {
    editor.addComponents(wrapInSection(`<mj-button>Click</mj-button>`));
    const style = getColumnChild(editor)?.getStyle();
    expect(style?.["background-color"]).toBe("#414141");
    expect(style?.["border-radius"]).toBe("3px");
    expect(style?.["font-size"]).toBe("13px");
    expect(style?.["font-weight"]).toBe("400");
    expect(style?.["color"]).toBe("#ffffff");
    expect(style?.["vertical-align"]).toBe("middle");
    expect(style?.["padding-top"]).toBe("10px");
    expect(style?.["padding-bottom"]).toBe("10px");
    expect(style?.["padding-right"]).toBe("25px");
    expect(style?.["padding-left"]).toBe("25px");
    expect(style?.["align"]).toBe("center");
  });

  test("stylable 包含 vertical-align", () => {
    editor.addComponents(wrapInSection(`<mj-button>Click</mj-button>`));
    const stylable = getColumnChild(editor)?.get("stylable") as string[];
    expect(stylable).toContain("vertical-align");
  });

  test("vertical-align top 轉 HTML 為 td[valign='top']", () => {
    editor.addComponents(
      wrapInSection(`<mj-button vertical-align="top">Click</mj-button>`)
    );
    const doc = parseHtml(toHtml(editor));
    const td = doc.querySelector("td[valign='top']");
    expect(td).not.toBeNull();
  });

  test("vertical-align bottom 轉 HTML 為 td[valign='bottom']", () => {
    editor.addComponents(
      wrapInSection(`<mj-button vertical-align="bottom">Click</mj-button>`)
    );
    const doc = parseHtml(toHtml(editor));
    const td = doc.querySelector("td[valign='bottom']");
    expect(td).not.toBeNull();
  });
});
