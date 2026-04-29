// Specs: https://documentation.mjml.io/#mjml-wrapper
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType, expandPaddingShorthand, expandBackgroundPositionShorthand } from './utils';
import { type as typeBody } from './Body';
import { type as typeSection } from './Section';

export const type = 'mj-wrapper';

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
        name: getName(editor, 'wrapper'),
        draggable: componentsToQuery(typeBody),
        droppable: componentsToQuery(typeSection),
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
          'gap',
          'border-radius',
          'border',
          'border-width',
          'border-style',
          'border-color',
        ],
        'style-default': {
          'padding-left': '0px',
          'padding-right': '0px',
          'padding-top': '20px',
          'padding-bottom': '20px',
          'text-align': 'center',
        },
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
        style: 'pointer-events: all; display: table; width: 100%',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body>`,
          end: `</mj-body></mjml>`,
        };
      },

      getChildrenSelector() {
        if(this.model.getAttributes()['full-width']){
          return 'table > tbody > tr > td > div table > tbody > tr > td';
        }else
          return 'table > tbody > tr > td';
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', () => {
          this.getChildrenContainer().innerHTML = this.model.get('content')!;
          this.renderChildren();
        });
      },
    }
  });
};
