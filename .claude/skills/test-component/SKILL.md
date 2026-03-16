---
name: test-component
description: 為指定的 MJML 元件產生 Jest + Playwright 測試
user-invocable: true
---

依照以下方法論，為 `$ARGUMENTS` 元件產生完整測試。
若未提供元件名稱，詢問使用者。

# 元件測試方法論

## 測試分層原則

| 層次 | 工具 | 測試對象 |
|------|------|----------|
| Model 層 | Jest | defaults、style-default、stylable、draggable、traits |
| View 層 | Playwright | canvas iframe 實際渲染結果 |

不要在 Jest 測試 DOM 渲染，不要在 Playwright 測試 model 屬性。

---

## Ground Truth 確認流程

先確認 MJML 官方文件對該元件的屬性和預設值描述，再用 MJML CLI 產生 HTML，從 HTML 結構和屬性判斷 Playwright 的 selector 和斷言目標。

### 步驟一：分別輸出有/無屬性的 HTML，比較差異

```bash
# 沒有屬性（baseline）
echo '<mjml><mj-body><mj-section><mj-column><mj-button>Click</mj-button></mj-column></mj-section></mj-body></mjml>' | npx mjml -i > /tmp/without.html

# 有屬性
echo '<mjml><mj-body><mj-section><mj-column><mj-button vertical-align="top">Click</mj-button></mj-column></mj-section></mj-body></mjml>' | npx mjml -i > /tmp/with.html

diff /tmp/without.html /tmp/with.html
```

### 步驟二：從 diff 判斷

- 差異在哪個 tag（`td`、`div`、`p`、`a`）
- 差異是 HTML attribute（`valign`、`align`）還是 inline style
- 確認 selector：用差異出現的 tag + attribute 組合

**根據 diff 決定 Playwright selector 和斷言目標，不要憑直覺猜。**

---

## Jest 測試規範

### 檔案位置
`tests/unit/<ComponentName>.test.ts`

### Helper 函式
使用專案內的 helper，不要自己 mock GrapesJS：

```ts
import { createEditor, getComponentModel } from '../helpers'

const editor = createEditor()
const model = getComponentModel(editor, 'mj-text')
```

### 測試方式
- 用 `model.get('style-default')` 取樣式預設值
- 用 `model.get('stylable')` 取可編輯屬性列表
- **不要用 snapshot**，改用明確斷言：

```ts
// 正確
expect(styleDefault['font-size']).toBe('14px')

// 錯誤（避免）
expect(styleDefault).toMatchSnapshot()
```

- 樣式斷言用 `toHaveStyle` 或直接比對字串值，但是要確認 selector 是準確的，參考 diff 的內容推論。

---

## Playwright 測試規範

### 檔案位置
`tests/specs/<ComponentName>.spec.ts`

### 注入元件
透過 `window.editor.setComponents()` 注入 MJML：

```ts
await page.evaluate((mjml) => {
  window.editor.setComponents(mjml)
}, `<mj-section><mj-column><mj-text>Hello</mj-text></mj-column></mj-section>`)
```

### 取得 canvas 內的 DOM
canvas 是 iframe，需用 `frameLocator`：

```ts
const frame = page.frameLocator('#gjs iframe')
const el = frame.locator('td')
```

### Selector 原則
- 使用最精確的 selector，避免用 `.first()`
- 優先用語意化 selector（`[data-gjs-type]`、tag name）
- 如需多層，用 `>` 直接子元素 selector

### 斷言方式
- 樣式：`await expect(el).toHaveCSS('font-size', '14px')`
- 屬性：`await expect(el).toHaveAttribute('align', 'left')`
- 文字：`await expect(el).toHaveText('...')`

### 等待策略
- 預設 Playwright auto-wait 已足夠
- 若渲染較慢，用 `waitFor` 而非 `page.waitForTimeout`

---

## 完成後輸出執行指令

測試檔案產生完畢後，**務必**在回覆末尾提供以下執行指令（替換 `<ComponentName>` 為實際元件名稱）：

```bash
# Jest（Model 層）
npx jest tests/specs/components/<ComponentName>.test.ts --no-coverage

# Playwright（View 層，需先啟動 dev server）
npx playwright test tests/e2e/<ComponentName>.spec.ts
```
