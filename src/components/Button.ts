// Specs: https://documentation.mjml.io/#mj-button
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeColumn } from './Column';
import { type as typeHero } from './Hero';
import { type as typeAttributes } from './Attributes';

export const type = 'mj-button';

export default (editor:  Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    extend: 'link',
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'button'),
        draggable: componentsToQuery([typeColumn, typeHero, typeAttributes]),
        highlightable: false,
        stylable: [
          'width', 'height',
          'background-color', 'container-background-color',
          'font-style', 'font-size', 'font-weight', 'font-family', 'color',
          'line-height', 'letter-spacing',
          'text-decoration', 'text-transform', 'text-align', 'align',
          'vertical-align',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',
          'inner-padding',
        ],
        'style-default': {
          'background-color': '#414141',
          'border-radius': '3px',
          'font-size': '13px',
          'font-weight': '400',
          'color': '#ffffff',
          'line-height': '120%',
          'text-decoration': 'none',
          'text-transform': 'none',
          'vertical-align': 'middle',
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
          'align': 'center',
        },
        traits: [
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
          { type: 'text', name: 'rel', label: 'Rel' },
          { type: 'text', name: 'name', label: 'Name' },
          { type: 'text', name: 'title', label: 'Title' },
        ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'display: table; width: 100%',
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
        return 'a,p';
      },

      /**
       * Prevent content repeating
       */
       rerender() {
        this.render();
      },
    },
  });
};
