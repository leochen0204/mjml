# gjsmjml

MJML 元件整合 GrapesJS 的外掛。

## GrapesJS 核心概念

### Model / View 分離
- **Model**：元件的資料層，包含 type、style、attributes、traits
- **View**：元件的渲染層，決定如何在 canvas iframe 裡呈現

### 元件結構
每個元件在 `src/components/<Name>.ts` 定義：
- `model.defaults`：預設屬性（style-default、stylable、draggable）
- `view.tagName`：canvas 裡渲染的 HTML tag
- `view.getMjmlTemplate()`：sandbox 渲染用的包裝結構
- `view.getChildrenSelector()`：可編輯內容的 selector

### Canvas 渲染流程
MJML → GrapesJS sandbox（getMjmlTemplate 包裝）→ mjml-core → iframe DOM

### 元件設計模式
詳見 `docs/component-patterns.md`，涵蓋四種 extend 策略、解析流程、渲染流程、style ↔ attributes 同步機制。

### 重要工具
- `editor.Commands.run("mjml-code-to-html")`：整份文件轉 HTML
- `editor.Commands.run("mjml-code")`：取得 MJML 字串
- `window.editor.setComponents(...)`：注入 MJML（Playwright 用）
