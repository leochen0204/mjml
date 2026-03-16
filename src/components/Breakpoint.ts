// Specs: https://documentation.mjml.io/#mj-breakpoint
// mj-breakpoint 會影響整份文件編譯後的 media query 斷點，
// 但由於 GrapesJS 畫布是逐一編譯各元件而非整份文件，
// 因此斷點效果不會反映在畫布上，僅在最終匯出的 HTML 中生效。
import type { Editor } from 'grapesjs';
import { isComponentType, componentsToQuery } from './utils';
import { type as typeHead } from './Head';

export const type = 'mj-breakpoint';

export default (editor: Editor) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      defaults: {
        draggable: componentsToQuery(typeHead),
        droppable: false,
        void: true,
        traits: [{ name: 'width' }],
      },
    },
  });
};
