import { Editor } from 'grapesjs';
import { initEditor, wrapInHead } from '../../helpers';

// 用 findType 穿透整棵 component tree，避免 DOMParser head/body wrapper 問題
const findMjHead = (editor: Editor) =>
  editor.DomComponents.getWrapper()?.findType('mj-head')[0];

const findMjAttributes = (editor: Editor) =>
  editor.DomComponents.getWrapper()?.findType('mj-attributes')[0];

describe('mj-class', () => {
  let editor: Editor;

  beforeEach(async () => {
    editor = await initEditor();
  });

  afterEach(() => editor.destroy());

  describe('元件識別', () => {
    it('mj-class 應被識別為正確的 type', () => {
      editor.addComponents(
        wrapInHead(`<mj-attributes><mj-class name="red" color="#ff0000" /></mj-attributes>`)
      );

      const classComp = findMjAttributes(editor)?.components().at(0);
      expect(classComp?.get('type')).toBe('mj-class');
    });

    it('mj-class 只能放在 mj-attributes 裡', () => {
      editor.addComponents(
        wrapInHead(`<mj-attributes><mj-class name="red" color="#ff0000" /></mj-attributes>`)
      );

      const classComp = findMjAttributes(editor)?.components().at(0);
      expect(classComp?.get('draggable')).toContain('[data-gjs-type="mj-attributes"]');
    });

    it('mj-class 為 void 元素', () => {
      editor.addComponents(
        wrapInHead(`<mj-attributes><mj-class name="red" /></mj-attributes>`)
      );

      const classComp = findMjAttributes(editor)?.components().at(0);
      expect(classComp?.get('void')).toBe(true);
    });
  });

  describe('MJML 序列化', () => {
    it('name 屬性正確保留', () => {
      editor.addComponents(
        wrapInHead(`<mj-attributes><mj-class name="hero" font-size="32px" color="#ff0000" /></mj-attributes>`)
      );

      const classComp = findMjAttributes(editor)?.components().at(0);
      const html = classComp?.toHTML();

      expect(html).toContain('name="hero"');
      expect(html).toContain('font-size="32px"');
      expect(html).toContain('color="#ff0000"');
    });

    it('padding shorthand 正確序列化', () => {
      editor.addComponents(
        wrapInHead(`<mj-attributes><mj-class name="btn" padding="10px 20px" /></mj-attributes>`)
      );

      const classComp = findMjAttributes(editor)?.components().at(0);
      const html = classComp?.toHTML();

      expect(html).toContain('name="btn"');
      expect(html).toMatch(/padding/);
    });

    it('多個 mj-class 各自獨立序列化', () => {
      editor.addComponents(
        wrapInHead(`
          <mj-attributes>
            <mj-class name="foo" font-size="10px" />
            <mj-class name="bar" font-size="20px" />
          </mj-attributes>
        `)
      );

      const attrsComp = findMjAttributes(editor);
      expect(attrsComp?.components().length).toBe(2);

      const foo = attrsComp?.components().at(0)?.toHTML();
      const bar = attrsComp?.components().at(1)?.toHTML();

      expect(foo).toContain('name="foo"');
      expect(bar).toContain('name="bar"');
    });
  });
});
