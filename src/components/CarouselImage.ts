// Specs: https://documentation.mjml.io/#mj-carousel
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeCarousel } from './Carousel';

export const type = 'mj-carousel-image';

export default (editor: Editor, { coreMjmlModel, coreMjmlView }: ComponentPluginOptions) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    extend: 'image',

    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'carouselImage'),
        draggable: componentsToQuery(typeCarousel),
        selectable: false,
        highlightable: false,
        stylable: ['border-radius'],
        'style-default': {
          'border-radius': '6px',
        },
        void: true,
        traits: [
          { type: 'text', name: 'src', changeProp: 1 },
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
          { name: 'rel' },
          { name: 'alt' },
          { name: 'title' },
          { type: 'text', name: 'thumbnails-src', label: 'Thumbnail URL' },
          { type: 'text', name: 'tb-border', label: 'Thumb Border' },
          { type: 'text', name: 'tb-border-radius', label: 'Thumb Border Radius' },
        ],
      },

      getAttrToHTML() {
        const attr = coreMjmlModel.getAttrToHTML.call(this);
        const src = this.get('src');
        if (src) attr.src = src;
        return attr;
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {},

      getMjmlTemplate() {
        const parentView = this.model.parent()?.view;
        // @ts-ignore
        if (parentView?.getInnerMjmlTemplate) {
          const carouselMjml = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml><mj-body><mj-section><mj-column>${carouselMjml.start}`,
            end: `${carouselMjml.end}</mj-column></mj-section></mj-body></mjml>`,
          };
        }
        return {
          start: `<mjml><mj-body><mj-section><mj-column><mj-carousel>`,
          end: `</mj-carousel></mj-column></mj-section></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl: any) {
        const img = sandboxEl.querySelector('.mj-carousel-image img');
        if (img) return img.outerHTML;
        return '';
      },

      getChildrenSelector() {
        return 'img';
      },

      render(p: any, c: any, opts: any, appendChildren: boolean) {
        coreMjmlView.render.call(this, p, c, opts, appendChildren);
        const idx = (this.model.collection?.indexOf(this.model) ?? 0) + 1;
        this.el.classList.add('mj-carousel-image', `mj-carousel-image-${idx}`);
        this.el.style.removeProperty('display');
        return this;
      },
    },
  });
};
