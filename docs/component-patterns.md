# 元件設計模式

每個 MJML 元件依照「內容性質」選擇不同的 `extend` 策略。

---

## 四種模式

### 模式一：`extend: 'text'` — 有 HTML 子內容

適用於內容是任意 HTML 字串的元件。GrapesJS 把 `content` 屬性當字串儲存，不走 child component tree。

| 元件 | 子內容性質 | `getChildrenSelector` |
|---|---|---|
| `mj-text` | 富文字，RTE 可即時編輯 | `td > div` |
| `mj-table` | table rows，整塊替換 | `td > table` |
| `mj-button` | 按鈕文字 | `a, p` |

**渲染流程：**
```
getTemplateFromMjml()       → mjml-core 編譯空骨架
el.innerHTML = 骨架          → 建立 canvas 結構
updateContent()             → container.innerHTML = model.get('content')
```

**為何 mj-table 需要自訂 `isComponent`：**

`<tr>/<td>/<th>` 在 `text/html` 解析時會被 HTML5 parser 的 foster parenting 移出未知元素，導致 `el.innerHTML` 為空。解法：
1. `useXmlParser: true` → `DOMParser.parseFromString(mjml, 'text/xml')` 保留結構
2. `isComponent` 在 GrapesJS 遞迴子節點前搶先存 `el.innerHTML`
3. `init()` 用 `comps.reset()` 清掉任何殘留 child components

---

### 模式二：`extend: 'image'` — void element

適用於無子內容、資料全在 attributes 的元件。

| 元件 | 說明 |
|---|---|
| `mj-image` | src、href、alt 透過 traits 綁定 model attributes |

改 trait → `change:attributes` → `rerender()`，不需要 `updateContent()`。

---

### 模式三：無 extend — 純屬性葉節點

適用於沒有子內容、也不接受 drop 的元件。

| 元件 | 說明 |
|---|---|
| `mj-divider` | `droppable: false`，樣式完全由 attributes 控制 |
| `mj-spacer` | 同上 |

`getChildrenSelector` 只用來定位 canvas 裡的 DOM 元素，不填內容。

---

### 模式四：無 extend — 容器元件

適用於可以放入子 Component 的容器，子元件是真正的 GrapesJS Component tree。

| 元件 | 可放入的子元件 |
|---|---|
| `mj-body` | `mj-section`、`mj-wrapper` |
| `mj-section` | `mj-column`、`mj-group` |
| `mj-column` | 所有葉節點元件 |

`renderChildren()` 渲染的是 `model.components()` collection（不是 `content` 字串）。

`mj-column` 特別之處：自己 override `render()` 和 `getTemplateFromMjml()`，因為需要同時抓 `<style>` 處理 responsive columns，並把兄弟 column 數量納入 MJML 模板計算寬度。

---

## 決策樹

```
這個元件有子內容嗎？
├─ 否，是 void element（img）        → extend: 'image'
├─ 否，純靠 attributes 控制          → 無 extend，droppable: false
├─ 是，內容是 HTML 字串              → extend: 'text'
│    └─ 子節點是特殊 HTML（tr/td）？
│         └─ 是 → 自訂 isComponent 搶存 innerHTML
└─ 是，內容是子 Component            → 無 extend，設定 droppable
```

---

## 解析流程：MJML → Model

```
setComponents(mjmlString)
  ↓
Parser（text/xml 或 text/html）
  ↓
對每個 DOM 節點呼叫 isComponent(el)
  → 回傳 { type, ...data } 合併進 model.defaults
  ↓
new ComponentModel(data)
  → model.init() 執行
  ↓
Component 進入 component tree
```

---

## 渲染流程：Model → Canvas DOM

```
view.render()
  ↓
getTemplateFromMjml()
  → getMjmlTemplate()        包裝用的外層 MJML
  → getInnerMjmlTemplate()   元件自身的 MJML tag + attributes
  → mjml-core 編譯
  → getTemplateFromEl()      從編譯結果取出需要的片段
  ↓
el.innerHTML = 骨架 HTML
  ↓
renderChildren()
  → updateContent()          填入 content 字串（text 類）
  → ComponentsView.render()  渲染子 Component（容器類）
```

---

## coreMjmlModel 的 style ↔ attributes 同步

所有元件都 spread `coreMjmlModel`，其中最關鍵的機制：

```
使用者改 Style Manager
  → change:style
  → handleStyleChange()  → set('attributes', style)
  → change:attributes
  → handleAttributeChange() → setStyle(attributes)

coreMjmlView 監聽 change:attributes
  → rerender()
```

MJML attributes（如 `font-size`、`color`）同時是 CSS style，所以 model 裡 style 和 attributes 保持同步，`toHTML()` 輸出時用 `getAttrToHTML()` 過濾掉和 `style-default` 相同的值，避免輸出冗餘屬性。
