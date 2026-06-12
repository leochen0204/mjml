// Specs: https://documentation.mjml.io/#mj-image
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType, expandPaddingShorthand } from './utils';
import { type as typeSection } from './Section';
import { type as typeColumn } from './Column';
import { type as typeHero } from './Hero';

export const type = 'mj-image';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    extend: 'image',
    model: {
      ...coreMjmlModel,
      init() {
        expandPaddingShorthand(this);
        coreMjmlModel.init.call(this);
      },
      defaults: {
        resizable: false,
        highlightable: false,
        name: getName(editor, 'image'),
        draggable: componentsToQuery([typeSection, typeColumn, typeHero]),
        stylable: [
          'width',
          'height',
          'max-height',
          'font-size',
          'padding',
          'padding-top',
          'padding-left',
          'padding-right',
          'padding-bottom',
          'border-radius',
          'border-top-left-radius',
          'border-top-right-radius',
          'border-bottom-left-radius',
          'border-bottom-right-radius',
          'border',
          'border-width',
          'border-style',
          'border-color',
          'container-background-color',
          'align',
        ],
        'style-default': {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
          'align': 'center',
          'font-size': '13px',
        },
        traits: [
          { name: 'src', changeProp: 1 },
          'href',
          {
            type: 'select',
            name: 'target',
            label: 'Target',
            options: [
              { id: '', label: 'Default' },
              { id: '_blank', label: '_blank' },
              { id: '_self', label: '_self' },
              { id: '_parent', label: '_parent' },
              { id: '_top', label: '_top' },
            ],
          },
          { type: 'text', name: 'name', label: 'Name' },
          'rel',
          'alt',
          'title',
          { type: 'text', name: 'srcset', label: 'Srcset' },
          { type: 'text', name: 'sizes', label: 'Sizes' },
          { type: 'text', name: 'usemap', label: 'Usemap' },
          {
            type: 'checkbox',
            name: 'fluid-on-mobile',
            label: 'Fluid on Mobile',
            valueTrue: 'true',
            valueFalse: '',
          },
        ],
        void: false,
      },

      getStylesToAttributes() {
        const style = coreMjmlModel.getStylesToAttributes.call(this);

        // Fix #339
        if (style.width === 'auto') {
          delete style.width;
        }

        return style;
      },

      // src is not in stylable, so Component.setStyle strips it from the style/attributes
      // sync cycle. Store it directly on model.src and read it back in getAttrToHTML.
      getAttrToHTML() {
        const attr = coreMjmlModel.getAttrToHTML.call(this);
        const src = this.get('src');
        if (src) attr.src = src;
        else delete attr.src;
        return attr;
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%; user-select: none;',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body><mj-column>`,
          end: `</mj-column></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.querySelector('tr').innerHTML;
      },

      getChildrenSelector() {
        return 'img';
      },
    },
  });
};
