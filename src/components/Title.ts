// Specs: https://documentation.mjml.io/#mj-title
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, isComponentType, mjmlConvert } from './utils';
import { type as typeHead } from './Head';

export const type = 'mj-title';

export default (editor: Editor, { opt, coreMjmlModel, coreMjmlView, sandboxEl }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        draggable: componentsToQuery(typeHead),
        void: false,
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-head>`,
          end: `</mj-head><mj-body></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl: any) {
        const title = sandboxEl.querySelector('title');
        return title ? title.textContent || '' : '';
      },

      renderStyle() {
        this.el.style.display = 'none';
      },

      renderChildren() {},

      getTemplateFromMjml() {
        const mjmlTmpl = this.getMjmlTemplate();
        const innerMjml = this.getInnerMjmlTemplate();
        const content = this.model.getInnerHTML() || '';
        const htmlOutput = mjmlConvert(
          opt.mjmlParser,
          `${mjmlTmpl.start}${innerMjml.start}${content}${innerMjml.end}${mjmlTmpl.end}`,
          opt.fonts,
        );
        let html = htmlOutput.html;
        const start = html.indexOf('<head>') + 6;
        const end = html.indexOf('</head>');
        html = html.substring(start, end).trim();
        sandboxEl.innerHTML = html;
        return this.getTemplateFromEl(sandboxEl);
      },
    },
  });
};
