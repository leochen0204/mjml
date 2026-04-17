import { Editor } from 'grapesjs';
import { initEditor } from '../helpers';
import { convertSelfClosingMjmlTags } from '../../src/components/utils';

const minimalMjml = `
<mjml>
  <mj-head>
    <mj-title>Your Title</mj-title>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

describe('preParser 字串前處理', () => {
  let editor: Editor;

  beforeEach(async () => {
    editor = await initEditor();
  });

  afterEach(() => editor.destroy());

  test('setComponents 後第一個頂層元件型別應為 mjml', () => {
    editor.setComponents(minimalMjml);

    const firstChild = editor.getComponents().at(0);

    expect(firstChild?.get('type')).toBe('mjml');
  });

test('解析 MJML 時頂層不含 <head>/<body> 元件', () => {
    editor.setComponents(minimalMjml);

    const types = editor.getComponents().models.map(c => c.get('type'));
    expect(types).not.toContain('head');
    expect(types).not.toContain('body');
  });
});

describe('convertSelfClosingMjmlTags', () => {
  test('自閉合 mj-* 標籤轉換為開閉合形式', () => {
    expect(convertSelfClosingMjmlTags('<mj-image src="x.png"/>')).toBe('<mj-image src="x.png"></mj-image>');
    expect(convertSelfClosingMjmlTags('<mj-divider/>')).toBe('<mj-divider></mj-divider>');
    expect(convertSelfClosingMjmlTags('<mj-image src="a.png" alt="test" />')).toBe('<mj-image src="a.png" alt="test" ></mj-image>');
    expect(convertSelfClosingMjmlTags('<mj-image\n  src="x.png"\n/>')).toBe('<mj-image\n  src="x.png"\n></mj-image>');
  });

  test('非 mj-* 自閉合標籤不受影響', () => {
    const html = '<br/><img src="x.png"/>';
    expect(convertSelfClosingMjmlTags(html)).toBe(html);
  });
});

