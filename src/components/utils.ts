import type { Editor } from 'grapesjs';
import { MJMLParsingOptions } from 'mjml-core';
import { MjmlParser } from './parser';

export const isComponentType = (type: string) => (el: Element) => (el.tagName || '').toLowerCase() === type;

export const convertSelfClosingMjmlTags = (mjml: string): string =>
  mjml.replace(/<(mj-[a-z-]+)(\s[^>]*)?\s*\/>/g, '<$1$2></$1>');

// 瀏覽器 HTML parser 的 foster parenting 機制會將 <table>/<tr>/<td> 從未知元素內移出，
// 導致 <mj-table> 的 innerHTML 在解析後變空。
// 此函式在進入 parser 前將 <mj-table> 的 innerHTML 編碼為 data-content 屬性，
// 繞過結構重排邏輯，由 isComponent 再 decode 還原內容。
export const encodeMjTableContent = (mjml: string): string =>
  mjml.replace(/<mj-table(\s[^>]*)?>(\s[\s\S]*?)<\/mj-table>/g, (_, attrs = '', content: string) => {
    const encoded = encodeURIComponent(content);
    return `<mj-table${attrs} data-content="${encoded}"></mj-table>`;
  });

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
