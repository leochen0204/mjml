import { Editor } from 'grapesjs';
import { initEditor } from '../helpers';

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

describe('parserHtml fallback（無自訂 parserHtml）', () => {
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
});
