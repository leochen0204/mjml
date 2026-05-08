// Specs: https://documentation.mjml.io/#mj-carousel
import type { Editor } from 'grapesjs';
import { ComponentPluginOptions } from '.';
import { componentsToQuery, getName, isComponentType, mjmlConvert } from './utils';
import { type as typeColumn } from './Column';
import { type as typeHero } from './Hero';
import { type as typeCarouselImage } from './CarouselImage';

export const type = 'mj-carousel';

export default (editor: Editor, { opt, coreMjmlModel, coreMjmlView, sandboxEl }: ComponentPluginOptions) => {

  editor.Components.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      getAttrToHTML() {
        const attr = coreMjmlModel.getAttrToHTML.call(this);
        const sd = this.get('style-default') || {};
        if (!attr['left-icon']) attr['left-icon'] = this.get('attributes')?.['left-icon'] || sd['left-icon'];
        if (!attr['right-icon']) attr['right-icon'] = this.get('attributes')?.['right-icon'] || sd['right-icon'];
        return attr;
      },
      defaults: {
        name: getName(editor, 'carousel'),
        draggable: componentsToQuery([typeColumn, typeHero]),
        droppable: componentsToQuery(typeCarouselImage),
        stylable: [
          'align',
          'border-radius',
          'tb-border',
          'tb-border-radius',
          'tb-width',
        ],
        'style-default': {
          'align': 'center',
          'border-radius': '6px',
          'tb-border': '2px solid transparent',
          'tb-border-radius': '6px',
          'tb-width': '110px',
          'icon-width': '44px',
          'tb-hover-border-color': '#fead0d',
          'tb-selected-border-color': '#ccc',
          'thumbnails': 'hidden',
          'left-icon': 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/chevron-left.svg',
          'right-icon': 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/chevron-right.svg',
        },
        traits: [
          {
            type: 'select',
            label: 'Align',
            name: 'align',
            options: [
              { value: 'left', name: 'Left' },
              { value: 'center', name: 'Center' },
              { value: 'right', name: 'Right' },
            ],
          },
          { type: 'text', name: 'left-icon', label: 'Left Arrow' },
          { type: 'text', name: 'right-icon', label: 'Right Arrow' },
          { type: 'text', name: 'icon-width', label: 'Icon Width' },
          { type: 'text', name: 'tb-hover-border-color', label: 'Thumb Hover Color' },
          { type: 'text', name: 'tb-selected-border-color', label: 'Thumb Active Color' },
          {
            type: 'checkbox',
            name: 'thumbnails',
            label: 'Thumbnails',
            valueTrue: 'visible',
            valueFalse: 'hidden',
          },
        ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {
        style: 'width: 100%; display: block;',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body><mj-section><mj-column>`,
          end: `</mj-column></mj-section></mj-body></mjml>`,
        };
      },

      getTemplateFromMjml() {
        const childrenMjml = (this.model.components().models as any[])
          .map((c: any) => c.toHTML()).join('');
        const { start, end } = this.getMjmlTemplate();
        const innerMjml = this.getInnerMjmlTemplate();
        const headHtml = this.getHeadHtml();
        const mjml = `${start.replace('<mjml>', `<mjml>${headHtml}`)}${innerMjml.start}${childrenMjml}${innerMjml.end}${end}`;

        const { html } = mjmlConvert(opt.mjmlParser, mjml, opt.fonts);

        sandboxEl.innerHTML = html;
        const style = Array.from(sandboxEl.querySelectorAll<HTMLStyleElement>('style'))
          .map(s => s.innerHTML).join(' ');

        const body = html.replace(/<body[^>]*>/, '<body>');
        sandboxEl.innerHTML = body.slice(body.indexOf('<body>') + 6, body.indexOf('</body>')).trim();

        const carouselEl = sandboxEl.querySelector<HTMLElement>('.mj-carousel');
        if (!carouselEl) {
          return { attributes: {}, content: '<div class="mj-carousel-images"></div>', style };
        }

        carouselEl.querySelectorAll<HTMLElement>('.mj-carousel-image')
          .forEach(el => { el.style.display = 'block'; });

        const attributes = Object.fromEntries(
          Array.from(carouselEl.attributes).map(a => [a.name, a.value])
        );

        return { attributes, content: carouselEl.innerHTML, style };
      },

      getChildrenSelector() {
        return '.mj-carousel-images';
      },

      render() {
        this.renderAttributes();

        const mjmlResult = this.getTemplateFromMjml();
        this.el.innerHTML = mjmlResult.content;
        this.$el.attr(mjmlResult.attributes);

        editor.addComponents(`<style>${mjmlResult.style}</style>`);

        const container = this.getChildrenContainer();
        if (container) container.innerHTML = '';
        
        this.renderChildren();
        this.renderStyle();
        this.postRender();
        return this;
      },

      init() {
        coreMjmlView.init.call(this);
        const children = this.model.get('components');
        if (!children) return;
        this.listenTo(children, 'add remove', this.render);
        this.listenTo(children, 'add', (child: any) => {
          this.listenTo(child, 'change:src change:attributes', this.render);
        });
        children.each((child: any) => {
          this.listenTo(child, 'change:src change:attributes', this.render);
        });
      },
    },
  });
};
