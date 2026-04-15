# 自訂 parserHtml

## 用途

`useXmlParser: false`（預設）時，plugin 會在 GrapesJS 的 HTML parser 入口注入一層包裝函式，
在 MJML 字串進入解析前做兩項前處理：

1. **`convertSelfClosingMjmlTags`**：將自閉合標籤展開
   ```
   <mj-image /> → <mj-image></mj-image>
   ```
   MJML 允許自閉合語法，但瀏覽器 HTML parser 對未知標籤不會自動展開，可能導致解析錯誤。

2. **`encodeMjTableContent`**：將 `<mj-table>` 的內容 encode 到 `data-content` 屬性
   ```
   <mj-table><tr><td>...</td></tr></mj-table>
   → <mj-table data-content="%3Ctr%3E..."></mj-table>
   ```
   瀏覽器的 foster parenting 機制會將 `<table>/<tr>/<td>` 從未知元素內移出，
   導致 `<mj-table>` 的 innerHTML 解析後變空。encode 後繞過此行為，
   再由元件的 `isComponent` 階段 decode 還原。

## 實作

```ts
// src/index.ts
const parserConfig = editor.Parser.getConfig();
const originalParserHtml = parserConfig.parserHtml;

parserConfig.parserHtml = (input: string, options: any) => {
  const processed = encodeMjTableContent(convertSelfClosingMjmlTags(input));
  if (originalParserHtml) return originalParserHtml(processed, options);
  return new DOMParser().parseFromString(processed, options?.htmlType || 'text/html').body as HTMLElement;
};
```

包裝邏輯：
- 先對 input 做前處理
- 若使用者已自訂 `parserHtml`，將前處理結果傳入並回傳其結果
- 否則用 `DOMParser` 解析並回傳 `.body`（與 GrapesJS 內建 `BrowserParserHtml` 行為一致）

## 注意事項

- `parserConfig.parserHtml` 是 GrapesJS 提供給使用者的覆寫槽位，預設為 `undefined`。
  GrapesJS 的內建 parser（`BrowserParserHtml`）不會掛到此屬性上，因此 `originalParserHtml` 在一般情況下為 `undefined`。
- fallback 必須回傳 `.body` 而非 `.documentElement`。
  回傳 `<html>` 根節點會使 GrapesJS 將 `<head>` 和 `<body>` 解析為頂層元件，導致 `mjml` 被多包一層，Layers 面板無法正常顯示。詳見 `layer-panel-bug.md`。
- `useXmlParser: true` 時不走此路徑，兩者互不影響。
