// Specs: https://documentation.mjml.io/#mjml-social
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeSocial } from './Social';

export const type = 'mj-social-element';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'socialElement'),
        draggable: componentsToQuery(typeSocial),
        stylable: [
          'text-decoration',
          'align', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'background-color',
          'color',
          'vertical-align',
          'icon-size', 'icon-height', 'icon-padding', 'icon-position', 'text-padding',
        ],
        'style-default': {
          'align': 'center',
          'font-size': '13px',
          'line-height': '22px',
          'vertical-align': 'middle',
          'text-decoration': 'none',
        },
        traits: [
          {
            type: 'select',
            label: 'Icon',
            name: 'name',
            options: [
              { value: 'custom', name: 'Custom' },
              { value: 'facebook', name: 'Facebook' },
              { value: 'twitter', name: 'Twitter' },
              { value: 'google', name: 'Google' },
              { value: 'instagram', name: 'Instagram' },
              { value: 'web', name: 'Web' },
              { value: 'youtube', name: 'Youtube' },
              { value: 'pinterest', name: 'Pinterest' },
              { value: 'linkedin', name: 'Linkedin' },
              { value: 'snapchat', name: 'Snapchat' },
              { value: 'vimeo', name: 'Vimeo' },
              { value: 'tumblr', name: 'Tumblr' },
              { value: 'github', name: 'Github' },
              { value: 'soundcloud', name: 'SoundCloud' },
              { value: 'medium', name: 'Medium' },
              { value: 'dribbble', name: 'Dribbble' },
              { value: 'xing', name: 'Xing' },
            ]
          },
          { name: 'src' },
          { name: 'href' },
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
          { type: 'text', name: 'alt', label: 'Alt' },
          { type: 'text', name: 'title', label: 'Title' },
          { type: 'text', name: 'srcset', label: 'Srcset' },
          { type: 'text', name: 'sizes', label: 'Sizes' },
        ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'table',
      attributes: {
        style: 'float: none; display: inline-table;',
      },

      getMjmlTemplate() {
        let parentView = this.model.parent()?.view;

        // @ts-ignore
        if (parentView.getInnerMjmlTemplate) {
          let mjmlSocial = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml><mj-body><mj-column>${mjmlSocial.start}`,
            end: `${mjmlSocial.end}</mj-column></mj-body></mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body><mj-column><mj-social>`,
            end: `</mj-social></mj-column></mj-body></mjml>`,
          };
        }
      },

      getInnerMjmlTemplate() {
        const base = coreMjmlView.getInnerMjmlTemplate.call(this);
        // &#8203;（零寬空格）確保 MJML 一定輸出文字 td，canvas 才能顯示文字。
        // 僅影響 canvas sandbox 渲染，不影響實際 MJML 序列化輸出。
        return {
          start: base.start,
          end: `&#8203;${base.end}`,
        };
      },

      getTemplateFromEl(sandboxEl: any) {
        const table = sandboxEl.querySelector('table[style*="float:none"]');
        return table.innerHTML;
      },

      getChildrenSelector() {
        return 'tbody > tr > td + td a, tbody > tr > td + td span';
      }
    },
  });
};
