import type { Editor } from 'grapesjs';
import { RequiredPluginOptions } from '.';

export default (editor: Editor, opt: RequiredPluginOptions) => {

  if (opt.resetStyleManager) {
    editor.onReady(() => {
      const sectors = editor.StyleManager.getSectors();

      sectors.reset();
      sectors.add([{
        name: 'Dimension',
        open: false,
        buildProps: ['width', 'height', 'max-width', 'max-height', 'min-height', 'margin', 'padding', 'vertical-align'],
        properties: [{
          property: 'margin',
          properties: [
            { name: 'Top', property: 'margin-top' },
            { name: 'Right', property: 'margin-right' },
            { name: 'Bottom', property: 'margin-bottom' },
            { name: 'Left', property: 'margin-left' }
          ],
        }, {
          property: 'padding',
          detached: true,
          properties: [
            { name: 'Top', property: 'padding-top' },
            { name: 'Right', property: 'padding-right' },
            { name: 'Bottom', property: 'padding-bottom' },
            { name: 'Left', property: 'padding-left' }
          ],
        }, {
          property: 'icon-size',
          type: 'integer',
          defaults: '20px',
          units: ['px', '%']
        }, {
          property: 'vertical-align',
          type: 'select',
          list: [
            { value: 'top' },
            { value: 'middle' },
            { value: 'bottom' },
          ]
        }, {
          property: 'gap',
          name: 'Gap',
          type: 'integer',
          units: ['px'],
          min: 0,
        }],
      }, {
        name: 'Typography',
        open: false,
        buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'align', 'text-decoration', 'font-style', 'text-transform'],
        properties: [
          { name: 'Font', property: 'font-family' },
          { name: 'Weight', property: 'font-weight' },
          { name: 'Font color', property: 'color' },
          {
            property: 'text-align',
            type: 'radio',
            defaults: 'left',
            list: [
              { value: 'left', name: 'Left', className: 'fa fa-align-left' },
              { value: 'center', name: 'Center', className: 'fa fa-align-center' },
              { value: 'right', name: 'Right', className: 'fa fa-align-right' },
              { value: 'justify', name: 'Justify', className: 'fa fa-align-justify' }
            ],
          }, {
            property: 'align',
            type: 'radio',
            defaults: 'left',
            list: [
              { value: 'left', name: 'Left', className: 'fa fa-align-left' },
              { value: 'center', name: 'Center', className: 'fa fa-align-center' },
              { value: 'right', name: 'Right', className: 'fa fa-align-right' },
              { value: 'justify', name: 'Justify', className: 'fa fa-align-justify' }
            ],
          }, {
            property: 'text-decoration',
            type: 'radio',
            defaults: 'none',
            list: [
              { value: 'none', name: 'None', className: 'fa fa-times' },
              { value: 'underline', name: 'underline', className: 'fa fa-underline' },
              { value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough' }
            ],
          },{
            property: 'font-style',
            type: 'radio',
            defaults: 'normal',
            list: [
              { value: 'normal', name: 'Normal', className: 'fa fa-font'},
              { value: 'italic', name: 'Italic', className: 'fa fa-italic'}
            ],
          }, {
            property: 'text-transform',
            type: 'select',
            defaults: 'none',
            list: [
              { value: 'none', name: 'None' },
              { value: 'uppercase', name: 'Uppercase' },
              { value: 'lowercase', name: 'Lowercase' },
              { value: 'capitalize', name: 'Capitalize' },
            ],
          }],
      }, {
        name: 'Decorations',
        open: false,
        buildProps: ['background-color', 'container-background-color', 'background-url', 'background-repeat',
          'background-size', 'background-position-x', 'background-position-y', 'border-radius', 'border'],
        properties: [{
          name: 'Container Background',
          property: 'container-background-color',
          type: 'color',
        }, {
          property: 'background-url',
          type: 'file',
        }, {
          property: 'background-position-x',
          name: 'Background Position X',
          type: 'select',
          list: [
            { value: 'left', name: 'Left' },
            { value: 'center', name: 'Center' },
            { value: 'right', name: 'Right' },
          ],
        }, {
          property: 'background-position-y',
          name: 'Background Position Y',
          type: 'select',
          list: [
            { value: 'top', name: 'Top' },
            { value: 'center', name: 'Center' },
            { value: 'bottom', name: 'Bottom' },
          ],
        }, {
          property: 'border-radius',
          properties: [
            { name: 'Top', property: 'border-top-left-radius' },
            { name: 'Right', property: 'border-top-right-radius' },
            { name: 'Bottom', property: 'border-bottom-left-radius' },
            { name: 'Left', property: 'border-bottom-right-radius' }
          ],
        }, {
          property: 'border-detached',
          name: 'Border detached',
          type: 'composite',
          detached: true,
          properties: [
            { name: 'Width', property: 'border-width', type: 'integer', units: ['px', '%'] },
            {
              name: 'Style', property: 'border-style', type: 'select',
              list: [
                { value: 'none' },
                { value: 'solid' },
                { value: 'dotted' },
                { value: 'dashed' },
                { value: 'double' },
                { value: 'groove' },
                { value: 'ridge' },
                { value: 'inset' },
                { value: 'outset' }
              ]
            },
            { name: 'Color', property: 'border-color', type: 'color' },
          ],
        }],
      }, {
        name: 'Extra',
        open: false,
        properties: [{
          property: 'icon-size',
          name: 'Icon Size',
          type: 'integer',
          units: ['px'],
          full: true,
        }, {
          property: 'icon-height',
          name: 'Icon Height',
          type: 'integer',
          units: ['px'],
          full: true,
        }, {
          property: 'icon-position',
          name: 'Icon Position',
          type: 'select',
          full: true,
          list: [
            { value: 'left', name: 'Left' },
            { value: 'right', name: 'Right' },
          ],
        }, {
          property: 'text-padding',
          name: 'Text Padding',
          type: 'integer',
          units: ['px'],
          full: true,
        }, {
          property: 'icon-padding',
          name: 'Icon Padding',
          type: 'composite',
          detached: false,
          fromStyle: (style: Record<string, string>) => {
            const val = (style['icon-padding'] || '').trim();
            const v = val.split(/\s+/).filter(Boolean);
            let t = '', r = '', b = '', l = '';
            if (v.length === 1) { t = r = b = l = v[0]; }
            else if (v.length === 2) { t = b = v[0]; r = l = v[1]; }
            else if (v.length === 3) { t = v[0]; r = l = v[1]; b = v[2]; }
            else if (v.length === 4) { [t, r, b, l] = v; }
            return { 'icon-padding-top': t, 'icon-padding-right': r, 'icon-padding-bottom': b, 'icon-padding-left': l };
          },
          toStyle: (values: Record<string, string>) => ({
            'icon-padding': [values['icon-padding-top'], values['icon-padding-right'], values['icon-padding-bottom'], values['icon-padding-left']].filter(Boolean).join(' ') || '',
          }),
          properties: [
            { name: 'Top',    property: 'icon-padding-top',    type: 'integer', units: ['px', '%'] },
            { name: 'Right',  property: 'icon-padding-right',  type: 'integer', units: ['px', '%'] },
            { name: 'Bottom', property: 'icon-padding-bottom', type: 'integer', units: ['px', '%'] },
            { name: 'Left',   property: 'icon-padding-left',   type: 'integer', units: ['px', '%'] },
          ],
        }, {
          property: 'inner-background-color',
          name: 'Inner Background Color',
          type: 'color',
          full: true,
        }, {
          property: 'inner-border',
          name: 'Inner Border',
          type: 'text',
          full: true,
        }, {
          property: 'inner-border-top',
          name: 'Inner Border Top',
          type: 'text',
          full: true,
        }, {
          property: 'inner-border-right',
          name: 'Inner Border Right',
          type: 'text',
          full: true,
        }, {
          property: 'inner-border-bottom',
          name: 'Inner Border Bottom',
          type: 'text',
          full: true,
        }, {
          property: 'inner-border-left',
          name: 'Inner Border Left',
          type: 'text',
          full: true,
        }, {
          property: 'inner-border-radius',
          name: 'Inner Border Radius',
          type: 'integer',
          units: ['px', '%'],
          full: true,
        }, {
          property: 'inner-padding',
          name: 'Inner Padding',
          type: 'composite',
          detached: false,
          fromStyle: (style: Record<string, string>) => {
            const val = (style['inner-padding'] || '').trim();
            const v = val.split(/\s+/).filter(Boolean);
            let t = '', r = '', b = '', l = '';
            if (v.length === 1) { t = r = b = l = v[0]; }
            else if (v.length === 2) { t = b = v[0]; r = l = v[1]; }
            else if (v.length === 3) { t = v[0]; r = l = v[1]; b = v[2]; }
            else if (v.length === 4) { [t, r, b, l] = v; }
            return { 'inner-padding-top': t, 'inner-padding-right': r, 'inner-padding-bottom': b, 'inner-padding-left': l };
          },
          toStyle: (values: Record<string, string>) => ({
            'inner-padding': [values['inner-padding-top'], values['inner-padding-right'], values['inner-padding-bottom'], values['inner-padding-left']].filter(Boolean).join(' ') || '',
          }),
          properties: [
            { name: 'Top',    property: 'inner-padding-top',    type: 'integer', units: ['px', '%'] },
            { name: 'Right',  property: 'inner-padding-right',  type: 'integer', units: ['px', '%'] },
            { name: 'Bottom', property: 'inner-padding-bottom', type: 'integer', units: ['px', '%'] },
            { name: 'Left',   property: 'inner-padding-left',   type: 'integer', units: ['px', '%'] },
          ],
        }],
      },
      ]);
    });
  }

};
