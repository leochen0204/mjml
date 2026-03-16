// Specs: https://documentation.mjml.io/#mj-preview
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, isComponentType } from './utils';
import { type as typeHead } from './Head';

export const type = 'mj-preview';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
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

      renderStyle() {
        this.el.style.display = 'none';
      },

      renderChildren() {},

      getTemplateFromMjml() {
        return this.model.getInnerHTML() || '';
      },
    },
  });
};
