// Specs: https://documentation.mjml.io/#mj-navbar-link
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType, expandPaddingShorthand } from './utils';
import { type as typeNavBar } from './NavBar';

export const type = 'mj-navbar-link';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    extend: 'link',
    model: {
      ...coreMjmlModel,
      init() {
        expandPaddingShorthand(this);
        coreMjmlModel.init.call(this);
      },
      defaults: {
        name: getName(editor, 'navLink'),
        draggable: componentsToQuery(typeNavBar),
        highlightable: false,
        stylable: [
          'font-style',
          'font-size',
          'font-weight',
          'font-family',
          'line-height',
          'letter-spacing',
          'color',
          'text-decoration',
          'text-transform',
          'padding',
          'padding-top',
          'padding-left',
          'padding-right',
          'padding-bottom',
        ],
        'style-default': {
          'font-size': '13px',
          'line-height': '22px',
          'padding-top': '15px',
          'padding-bottom': '15px',
          'padding-left': '10px',
          'padding-right': '10px',
          'text-decoration': 'none',
          'text-transform': 'uppercase',
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
        ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'a',
      attributes: {
        style: 'float: none; display: inline-table;',
      },

      getMjmlTemplate() {
        let parentView = this.model.parent()?.view;
        // @ts-ignore
        if (parentView?.getInnerMjmlTemplate) {
          let mjmlNavBar = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml><mj-body><mj-column>${mjmlNavBar.start}`,
            end: `${mjmlNavBar.end}</mj-column></mj-body></mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body><mj-column><mj-navbar>`,
            end: `</mj-navbar></mj-column></mj-body></mjml>`,
          };
        }
      },

      /**
       * #305 prevent content repeating
       */
      rerender() {
        this.render();
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.querySelector('div').innerHTML;
      },

      getChildrenSelector() {
        return 'a,p';
      },
    },
  });
};
