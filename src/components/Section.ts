// Specs: https://documentation.mjml.io/#mj-section
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType, expandPaddingShorthand, expandBackgroundPositionShorthand } from './utils';
import { type as typeBody } from './Body';
import { type as typeWrapper } from './Wrapper';
import { type as typeAttributes } from './Attributes';
import { type as typeColumn } from './Column';
import { type as typeGroup } from './Group';

export const type = 'mj-section';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      init() {
        expandPaddingShorthand(this);
        expandBackgroundPositionShorthand(this);
        coreMjmlModel.init.call(this);
      },
      defaults: {
        name: getName(editor, 'section'),
        draggable: componentsToQuery([typeBody, typeWrapper, typeAttributes]),
        droppable: componentsToQuery([typeColumn, typeGroup]),
        'style-default': {
          'padding-left': '0px',
          'padding-right': '0px',
          'padding-top': '20px',
          'padding-bottom': '20px',
          'text-align': 'center',
          'background-position': 'top center',
        },
        stylable: [
          'text-align',
          'padding',
          'padding-top',
          'padding-left',
          'padding-right',
          'padding-bottom',
          'background-color',
          'background-url',
          'background-repeat',
          'background-size',
          'background-position-x',
          'background-position-y',
          'border-radius',
          'border-top-left-radius',
          'border-top-right-radius',
          'border-bottom-left-radius',
          'border-bottom-right-radius',
          'border',
          'border-width',
          'border-style',
          'border-color',
        ],
        traits: [
          'id',
          'title',
          {
            type: 'checkbox',
            label: 'Full width',
            name: 'full-width',
            valueTrue: 'full-width',
            valueFalse: '',
          },
          {
            type: 'select',
            name: 'direction',
            label: 'Direction',
            options: [
              { id: 'ltr', label: 'LTR' },
              { id: 'rtl', label: 'RTL' },
            ],
          },
        ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {
        style: 'pointer-events: all;',
      },

      getMjmlTemplate() {
        const parent = this.model.parent();
        const parentView = parent?.view;
        const parentTag = parent?.attributes.tagName;
        // @ts-ignore
        const getInnerMjmlTemplate = parentView?.getInnerMjmlTemplate;

        if (getInnerMjmlTemplate && parentTag === typeBody) {
          let mjmlBody = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml>${mjmlBody.start}`,
            end: `${mjmlBody.end}</mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body>`,
            end: `</mj-body></mjml>`,
          };
        }
      },

      getChildrenSelector() {
        if (this.model.getAttributes()['full-width']) {
          return 'table > tbody > tr > td > div table > tbody > tr > td';
        } else return 'table > tbody > tr > td';
      },

      postRender() {
        const parent = this.model.parent();
        if (parent?.attributes.tagName !== typeWrapper) return;
        const gap = parent.getStyle()?.['gap'] || parent.getAttributes()?.['gap'];
        if (!gap) return;
        const siblings = parent.get('components');
        const isFirst = siblings?.indexOf(this.model) === 0;
        this.el.style.marginTop = isFirst ? '' : gap;
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
        const parent = this.model.parent();
        if (parent?.attributes.tagName === typeWrapper) {
          this.listenTo(parent, 'change:style change:attributes', this.postRender);
        }
      },
    },
  });
};
