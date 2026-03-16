// Specs: https://documentation.mjml.io/#mj-table
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType, expandPaddingShorthand } from './utils';
import { type as typeColumn } from './Column';
import { type as typeHero } from './Hero';
import { type as typeAttributes } from './Attributes';

export const type = 'mj-table';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    extend: 'text',
    extendFnView: ['onActive'],

    isComponent(el: Element) {
      if ((el.tagName || '').toLowerCase() === type) {
        const dataContent = el.getAttribute('data-content');
        const content = dataContent ? decodeURIComponent(dataContent) : el.innerHTML;
        return { type, content };
      }
      return false;
    },

    model: {
      ...coreMjmlModel,
      init() {
        expandPaddingShorthand(this);
        coreMjmlModel.init.call(this);
        // GrapesJS 仍可能建立 child components，清掉以免 renderChildren 重複插入
        const comps = this.components();
        if (comps.length > 0) {
          comps.reset([], { silent: true });
        }
      },
      defaults: {
        name: getName(editor, 'table'),
        draggable: componentsToQuery([typeColumn, typeHero, typeAttributes]),
        highlightable: false,
        stylable: [
          'color',
          'font-family',
          'font-size',
          'line-height',
          'border',
          'align',
          'table-layout',
          'width',
          'padding',
          'padding-top',
          'padding-left',
          'padding-right',
          'padding-bottom',
          'container-background-color',
        ],
        'style-default': {
          color: '#000000',
          'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
          'font-size': '13px',
          'line-height': '22px',
          'table-layout': 'auto',
          width: '100%',
          border: 'none',
          align: 'left',
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
        },
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%',
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
        return 'td > table';
      },

      updateContent() {
        const container = this.getChildrenContainer();
        if (container) {
          container.innerHTML = this.model.get('content') || '';
        }
      },

      rerender() {
        this.render();
      },

      onActive() {
        this.getChildrenContainer().style.pointerEvents = 'all';
      },
    },
  });
};
