// Specs: https://documentation.mjml.io/#mj-attributes (mj-class)
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeAttributes } from './Attributes';

export const type = 'mj-class';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'class'),
        draggable: componentsToQuery(typeAttributes),
        droppable: false,
        void: true,
      },
    },
    view: {
      ...coreMjmlView,
      tagName: type,
      renderStyle() {},
      renderChildren() {},
      getTemplateFromMjml() {
        return '';
      },
    },
  });
};
