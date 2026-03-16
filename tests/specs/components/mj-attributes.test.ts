import { Editor } from "grapesjs";
import { initEditor, wrapInHead, getHeadChild, toHtml, parseHtml } from "../../helpers";

describe("mj-attributes", () => {
  let editor: Editor;

  beforeEach(async () => {
    editor = await initEditor();
  });

  afterEach(() => editor.destroy());

  test("元件存在且 type 正確", () => {
    editor.addComponents(wrapInHead(`<mj-attributes></mj-attributes>`));
    const comp = getHeadChild(editor);
    expect(comp).toBeTruthy();
    expect(comp?.get("type")).toBe("mj-attributes");
  });

  test("mj-all 全域樣式套用到 HTML 輸出", () => {
    editor.addComponents(`
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-all font-family="Arial" />
          </mj-attributes>
        </mj-head>
        <mj-body><mj-section><mj-column>
          <mj-text>Hello</mj-text>
        </mj-column></mj-section></mj-body>
      </mjml>
    `);

    const doc = parseHtml(toHtml(editor));
    const el = doc.querySelector("div[style*='font-family']");
    expect(el).not.toBeNull();
    expect(el).toHaveStyle({ "font-family": "Arial" });
  });

  test("mj-text 全域樣式覆寫到 HTML 輸出", () => {
    editor.addComponents(`
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-text font-size="24px" color="#123456" />
          </mj-attributes>
        </mj-head>
        <mj-body><mj-section><mj-column>
          <mj-text>Hello</mj-text>
        </mj-column></mj-section></mj-body>
      </mjml>
    `);
    const doc = parseHtml(toHtml(editor));
    const el = doc.querySelector("div[style*='font-size:24px']");
    expect(el).not.toBeNull();
    expect(el).toHaveStyle({ "font-size": "24px", color: "#123456" });
  });

  test("mj-section 全域背景色套用", () => {
    editor.addComponents(`
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-section background-color="#ff0000" />
          </mj-attributes>
        </mj-head>
        <mj-body><mj-section><mj-column>
          <mj-text>Hello</mj-text>
        </mj-column></mj-section></mj-body>
      </mjml>
    `);
    const doc = parseHtml(toHtml(editor));
    const el = doc.querySelector("div[style*='background:#ff0000']");
    expect(el).not.toBeNull();
    expect(el).toHaveStyle({ background: "#ff0000" });
  });

  test("mj-button 全域樣式套用", () => {
    editor.addComponents(`
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-button background-color="#abcdef" />
          </mj-attributes>
        </mj-head>
        <mj-body><mj-section><mj-column>
          <mj-button>Click</mj-button>
        </mj-column></mj-section></mj-body>
      </mjml>
    `);
    const doc = parseHtml(toHtml(editor));
    const el = doc.querySelector("td[style*='background:#abcdef']");
    expect(el).not.toBeNull();
    expect(el).toHaveStyle({ background: "#abcdef" });
  });
});
