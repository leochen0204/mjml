import grapesjs, { Editor, Component } from "grapesjs";
import grapesJSMJML from "../src";
import { JSDOM } from "jsdom";

export const initEditor = () =>
  new Promise<Editor>((resolve) => {
    const editor = grapesjs.init({
      container: "#gjs",
      plugins: [grapesJSMJML],
    });
    editor.getModel().loadOnStart();
    editor.on("change:readyLoad", () => resolve(editor));
  });

export const wrapInSection = (inner: string) =>
  `<mjml><mj-body><mj-section><mj-column>${inner}</mj-column></mj-section></mj-body></mjml>`;

export const getColumnChild = (editor: Editor, index = 0): Component | undefined =>
  editor.getComponents().at(0)  // mjml
    ?.components().at(0)         // mj-body
    ?.components().at(0)         // mj-section
    ?.components().at(0)         // mj-column
    ?.components().at(index);

export const wrapInHead = (inner: string) =>
  `<mjml><mj-head>${inner}</mj-head><mj-body></mj-body></mjml>`;

export const getHeadChild = (editor: Editor, index = 0): Component | undefined =>
  editor.getComponents().at(0)
    ?.components().find(c => c.get("type") === "mj-head")
    ?.components().at(index);

export const parseHtml = (html: string) =>
  new JSDOM(html).window.document;

export const toHtml = (editor: Editor) => {
  const { errors, html } = editor.Commands.run("mjml-code-to-html");
  expect(errors).toHaveLength(0);
  return html as string;
};
