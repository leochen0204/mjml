// Specs: https://documentation.mjml.io/#mj-attributes
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeHead } from './Head';

export const type = 'mj-attributes';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'attributes'),
        draggable: componentsToQuery(typeHead),
        droppable: true,
        void: false,
      },
    },
    view: {
      ...coreMjmlView,
      tagName: type,
      renderStyle() {
        this.el.style.display = 'none';
      },
      getTemplateFromMjml() {
        return '';
      },
    },
  });
};
