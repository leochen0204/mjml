# @leochen0204/grapesjs-mjml

MJML 元件整合 GrapesJS 的外掛，基於 [GrapesJS/mjml](https://github.com/GrapesJS/mjml) fork 開發。

## 安裝

```bash
npm install @leochen0204/grapesjs-mjml
```

## 使用方式

```js
import grapesjs from 'grapesjs';
import gjsMjml from '@leochen0204/grapesjs-mjml';

const editor = grapesjs.init({
  container: '#gjs',
  plugins: [gjsMjml],
  pluginsOpts: {
    [gjsMjml]: {
      // 選項
    },
  },
});
```

## 支援元件

### 結構元件

| 元件 | MJML 標籤 | 說明 |
|------|-----------|------|
| Body | `mj-body` | 郵件主體 |
| Section | `mj-section` | 區塊（橫列） |
| Column | `mj-column` | 欄位 |
| Group | `mj-group` | 欄位群組 |
| Wrapper | `mj-wrapper` | 包裝區塊 |
| Hero | `mj-hero` | Hero 區塊 |

### 內容元件

| 元件 | MJML 標籤 | 說明 |
|------|-----------|------|
| Text | `mj-text` | 文字 |
| Button | `mj-button` | 按鈕 |
| Image | `mj-image` | 圖片 |
| Divider | `mj-divider` | 分隔線 |
| Spacer | `mj-spacer` | 間距 |
| Raw | `mj-raw` | 自訂 HTML |

### 社群元件

| 元件 | MJML 標籤 | 說明 |
|------|-----------|------|
| Social | `mj-social` | 社群連結群組 |
| Social Element | `mj-social-element` | 單一社群連結 |
| NavBar | `mj-navbar` | 導覽列 |
| NavBar Link | `mj-navbar-link` | 導覽列連結 |

### Head 元件

| 元件 | MJML 標籤 | 說明 |
|------|-----------|------|
| Head | `mj-head` | 郵件 Head 區塊 |
| Title | `mj-title` | 郵件標題 |
| Preview | `mj-preview` | 收件匣預覽文字 |
| Breakpoint | `mj-breakpoint` | RWD 斷點（僅影響匯出 HTML） |
| Style | `mj-style` | 自訂 CSS |
| Font | `mj-font` | 自訂字型 |
| Attributes | `mj-attributes` | 全域預設屬性 |
| All | `mj-all` | 套用至所有元件的預設屬性 |

## 指令

```js
// 取得 MJML 字串
editor.Commands.run('mjml-code');

// 整份文件轉 HTML
editor.Commands.run('mjml-code-to-html');
```

## 開發

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器（http://localhost:8082）
npm start

# 建置
npm run build

# Lint
npm run lint
npm run lint:fix
```

## 測試

### Unit 測試（Jest）

```bash
# 執行所有測試
npm test

# 執行特定元件
npx jest mj-text
npx jest mj-button
npx jest mj-image
npx jest mj-attributes
```

### E2E 測試（Playwright）

需先啟動開發伺服器：

```bash
# 終端機 1
npm start

# 終端機 2：執行所有 e2e 測試
npx playwright test

# 執行特定元件
npx playwright test mj-text
npx playwright test mj-section
npx playwright test mj-attributes
```

## 發佈

```bash
# Bump prerelease 版號並建立 commit（e.g. 1.0.7-fork-rc.11 → 1.0.7-fork-rc.12）
npm version prerelease --preid=fork-rc -m "Release v%s"

npm run build
npm publish --tag next --access public
```

## 授權

BSD-3-Clause
