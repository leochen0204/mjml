import type { Editor } from 'grapesjs';
import { MJMLParsingOptions } from 'mjml-core';
import { MjmlParser } from './parser';

export const isComponentType = (type: string) => (el: Element) => (el.tagName || '').toLowerCase() === type;

export const convertSelfClosingMjmlTags = (mjml: string): string =>
  mjml.replace(/<(mj-[a-z-]+)(\s[^>]*)?\s*\/>/g, '<$1$2></$1>');


export function mjmlConvert(
  parser: MjmlParser,
  mjml: string,
  fonts: Record<string, string>,
  opts: Partial<MJMLParsingOptions> = {},
) {
  const options: MJMLParsingOptions = {
    useMjmlConfigOptions: false,
    mjmlConfigPath: undefined,
    filePath: undefined,
    ...opts,
  };

  // Check that fonts parameter is not empty for add to options
  if (fonts && Object.keys(fonts).length > 0 && fonts.constructor === Object) {
    // @ts-ignore
    options.fonts = fonts;
  }

  return parser(mjml, options);
}

export const componentsToQuery = (cmps: string | string[]): string => {
  const cmpsArr = Array.isArray(cmps) ? cmps : [cmps];
  return cmpsArr.map((cmp) => `[data-gjs-type="${cmp}"]`).join(', ');
};

export const getName = (editor: Editor, name: string): string => {
  return editor.I18n.t(`grapesjs-mjml.components.names.${name}`);
};

export function debounce<T extends (...params: any) => any>(clb: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: IArguments[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      clb.apply(this, args);
    }, wait);
  } as T;
}

export function expandBackgroundPositionShorthand(component: any) {
  const attrs = component.get('attributes') || {};

  if (!('background-position' in attrs)) return;

  const position = attrs['background-position'];
  if (!position || typeof position !== 'string') return;

  const values = position.trim().split(/\s+/);
  const xOnly = new Set(['left', 'right']);
  const yOnly = new Set(['top', 'bottom']);

  let x = 'center';
  let y = 'center';

  if (values.length === 1) {
    const v = values[0];
    if (xOnly.has(v)) x = v;
    else if (yOnly.has(v)) y = v;
    else x = y = v;
  } else if (values.length === 2) {
    const [v1, v2] = values;
    if (yOnly.has(v1)) { y = v1; x = v2; }
    else if (xOnly.has(v1)) { x = v1; y = v2; }
    else if (yOnly.has(v2)) { y = v2; x = v1; }
    else if (xOnly.has(v2)) { x = v2; y = v1; }
    else { x = v1; y = v2; }
  }

  attrs['background-position-x'] = attrs['background-position-x'] ?? x;
  attrs['background-position-y'] = attrs['background-position-y'] ?? y;

  delete attrs['background-position'];
  component.set('attributes', attrs);
}


export function expandPaddingShorthand(component: any) {
  const attrs = component.get('attributes') || {};

  if (!('padding' in attrs)) return;

  const padding = attrs.padding;
  if (!padding || typeof padding !== 'string') return;

  const values = padding.trim().split(/\s+/);

  if (values.length < 1 || values.length > 4) {
    return;
  }

  let top, right, bottom, left;

  switch (values.length) {
    case 1:
      top = right = bottom = left = values[0];
      break;
    case 2:
      top = bottom = values[0];
      right = left = values[1];
      break;
    case 3:
      top = values[0];
      right = left = values[1];
      bottom = values[2];
      break;
    case 4:
      [top, right, bottom, left] = values;
      break;
  }

  attrs['padding-top'] = attrs['padding-top'] ?? top;
  attrs['padding-right'] = attrs['padding-right'] ?? right;
  attrs['padding-bottom'] = attrs['padding-bottom'] ?? bottom;
  attrs['padding-left'] = attrs['padding-left'] ?? left;

  delete attrs.padding;

  component.set('attributes', attrs);
}
