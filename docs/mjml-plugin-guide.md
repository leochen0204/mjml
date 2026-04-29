# MJML Plugin 開發指南

## MJML Attr 如何進入 GrapesJS

Plugin 把 MJML 的 attributes 同時對應到 GrapesJS 的 style 和 attributes，兩者保持同步。實作在 `src/components/index.ts` 的 `coreMjmlModel`：

```
使用者改 Style Manager / Traits
  ↓
change:style / change:attributes
  ↓
handleStyleChange / handleAttributeChange（coreMjmlModel）
  ↓
style ↔ attributes 雙向同步
  ↓
toHTML() → getAttrToHTML() 過濾 style-default → 輸出 MJML attr
```

### 解析流程：MJML → Model

進入 GrapesJS 前，plugin 會先對 MJML 字串做前處理（`src/index.ts` parserHtml）。這是 fork 後自行新增的機制，原本 plugin 沒有這層處理：

1. **`convertSelfClosingMjmlTags`**：將自閉合標籤展開
   ```
   <mj-image /> → <mj-image></mj-image>
   ```

前處理完成後進入 GrapesJS 解析：

```
setComponents(mjmlString)
  ↓
Parser（text/xml 或 text/html）
  ↓
對每個 DOM 節點呼叫 isComponent(el)
  → 回傳 { type, ...data } 合併進 model.defaults
  ↓
new ComponentModel(data)
  → model.init() 執行（expandPaddingShorthand 等在此展開）
  ↓
Component 進入 component tree
```

### 渲染流程：Model → Canvas DOM

Canvas 的 iframe 顯示是由 `mjml-browser`（目前 v4.18.0，v4 最新版）編譯產生，最終匯出 HTML 也是同一套。因此 **mjml-browser 的版本直接決定 canvas 顯示和輸出結果**，部分屬性（如 `mj-hero` 的 `inner-padding`）在 v4 有 bug，需升級至 v5 才能正確渲染，詳見「已知限制」。

```
view.render()
  ↓
getTemplateFromMjml()
  → getMjmlTemplate()       包裝用的外層 MJML
  → getInnerMjmlTemplate()  元件自身的 MJML tag + attributes
  → mjml-browser 編譯（canvas 顯示與輸出同一版本）
  → getTemplateFromEl()     從編譯結果取出需要的片段
  ↓
el.innerHTML = 骨架 HTML
  ↓
renderChildren()
  → updateContent()         填入 content 字串（text 類）
  → ComponentsView.render() 渲染子 Component（容器類）
```

---

## stylable vs traits

兩者都是 UI 層設定，底層都進入 `attributes`，輸出成 MJML element 屬性：

```
stylable → Style Manager 面板  ┐
                               ├→ attributes → MJML 輸出
traits   → Traits 面板         ┘
```

### 判斷原則

- **stylable** — 視覺樣式屬性（color、padding、border、背景等）
- **traits** — 非樣式的功能屬性（href、target、direction、mode 等）

### Shorthand vs Detached

Style Manager 的 composite property 有兩種模式：

**非 detached（預設）**：子屬性合成 shorthand 輸出
```
使用者設定 border-width/style/color
→ 輸出：<mj-column border="2px solid #ff0000">
```

**Detached**：子屬性各自儲存輸出
```
使用者設定 border-width/style/color
→ 輸出：<mj-divider border-width="4px" border-style="solid" border-color="#000000">
```

| 元件 | 模式 | 原因 |
|------|------|------|
| mj-column / section / wrapper / button / image | shorthand | MJML 只接受 `border` shorthand |
| mj-divider | detached | MJML 接受三個獨立屬性 |

---

## 新增 Sector 或 Attr

1. 在元件的 `stylable` 陣列加入屬性名稱
2. 在 `src/style.ts` 對應 sector 的 `buildProps` 或 `properties` 補上定義
3. 如屬性是 shorthand（如 `inner-padding`），用 `fromStyle` / `toStyle` 處理拆解與組合

---

## attr 驗證流程

### 1. 確認 MJML 支援

```bash
echo '<mjml><mj-body>...<mj-xxx attr="val" /></mj-body></mjml>' | npx mjml --stdin
```

### 2. MJML diff

```bash
echo '<mjml>...<mj-xxx /></mjml>' | npx mjml --stdin > /tmp/without.html
echo '<mjml>...<mj-xxx attr="val" /></mjml>' | npx mjml --stdin > /tmp/with.html
diff /tmp/without.html /tmp/with.html
```

### 3. 更新 template.mjml

帶入目標 attr 值，dev server 有 hot-reload，存檔後直接反映。

### 4. 驗證（可搭配 AI）

開發者在瀏覽器 console，或請 AI 透過 Puppeteer MCP 依序執行：

```js
// 1. model attr 是否正確
editor.getWrapper().find('[data-gjs-type="mj-xxx"]')[0].getAttrToHTML()

// 2. MJML 字串是否帶入
editor.Commands.run('mjml-code')

// 3. canvas iframe 渲染結果
document.querySelector('.gjs-frame').contentDocument
  .querySelector('.target-element')?.getAttribute('style')
```

---

## 已知限制

### mj-navbar `hamburger`

漢堡選單依賴 JavaScript，大多數 email client 不執行 JS，實際效果有限。

### v4 不支援、v5 已修正的屬性

#### mj-hero

- `inner-padding`：v4 無效，v5 修正。
- `inner-padding-top/right/bottom/left`：v4 只套用 Outlook，跨 client 不一致，v5 修正。

**目前處理**：保留在 `stylable`，加 TODO 註解，等升級 v5 一併解決。

---

## mjml-browser v5.1.0 升級待辦

**1. API 從同步改為非同步**

v4：`const result = mjml2html(template, options)`
v5：`const result = await mjml2html(template, options)`

影響範圍：`mjmlConvert()`、`getTemplateFromMjml()`、`render()`、所有覆寫 `getMjmlTemplate` 的元件 view。

**2. 新增 peer dependency**：`npm install mjml-browser@5 cheerio`

**3. TypeScript 型別**：目前引用 `mjml-core`（v4）型別，升級後需確認相容性。

### 升級前驗證清單

- [ ] `mjmlConvert` 改為 async 後，canvas render 是否正常
- [ ] 所有元件 `getTemplateFromMjml` 改為 async 後，GrapesJS view 生命週期是否相容
- [ ] `inner-padding` 在 v5 正確渲染後，Hero `getChildrenSelector`（`.mj-hero-content`）是否仍正確
- [ ] 其他元件是否有 v4/v5 輸出差異（需逐一比對）
- [ ] e2e 測試全部通過
