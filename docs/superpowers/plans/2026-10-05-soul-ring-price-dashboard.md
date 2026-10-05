# 魂环与装备物价资料库 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从两张用户图片提取结构化资料，构建并发布一个可搜索、筛选且适配手机的魂环与装备物价网站。

**Architecture:** 使用静态 React/Vite 单页站点承载两个一级模块，结构化 JSON 作为唯一数据源，浏览器内完成搜索和筛选。独立提取脚本将人工复核后的 CSV/JSON 转成稳定的数据模型；站点构建为静态资源后发布到公开 HTTPS 地址。

**Tech Stack:** React 19、TypeScript、Vite、CSS、Vitest、Testing Library、Playwright、Node.js 数据校验脚本

**Spec:** `docs/superpowers/specs/2026-10-05-soul-ring-price-dashboard-design.md`

## Global Constraints

- 页面只展示两张原图中的资料，不从外部来源补造内容。
- 图 1 提取魂环名称、年限、属性、出处；图 2 提取名称、点券、龙金（组）、金币与分类。
- 暗器和戒指必须保存属性/等级区间与对应价格的关系。
- 无法可靠辨认的记录必须标记为“待核对”。
- 价格页必须显示“一区物价表（2026.8）”的数据日期语境。
- 网站无需登录、后台、交易功能或实时行情抓取。
- 电脑与手机均须可读，并提供键盘焦点状态。

## Review Focus

- 空白、全角空格或大小写混合的搜索输入应被标准化，不应产生错误结果。
- 缺失价格必须显示“—”，不能被转换成数值 0。
- “左右”“以上”和价格区间必须保留原义，不能错误压缩成单一精确价格。
- 多个筛选条件同时启用时必须取交集，清除筛选后恢复完整数据。
- 待核对记录在表格与移动卡片中都必须保留可见标识。

---

### Task 1: 项目骨架与数据契约

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/types.ts`
- Create: `src/data/validate.ts`
- Create: `src/data/validate.test.ts`

**Interfaces:**
- Consumes: 无。
- Produces: `SoulRingRecord`、`MarketItem`、`RangePriceRecord`、`DatasetMeta` 类型，以及 `validateDataset(input: unknown): Dataset`。

- [ ] **Step 1: 写数据契约失败测试**

在 `src/data/validate.test.ts` 覆盖有效魂环、缺失价格、区间显示文本、待核对状态，以及缺少必填字段时抛出错误。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/data/validate.test.ts`
Expected: FAIL，因为类型和 `validateDataset` 尚不存在。

- [ ] **Step 3: 创建最小 Vite/React 项目和数据类型**

在 `src/types.ts` 定义三类记录和 `Dataset`；在 `src/data/validate.ts` 实现 `validateDataset(input: unknown): Dataset`，保留空价格为 `null`，保留原始 `displayPrice`。

- [ ] **Step 4: 运行数据契约测试**

Run: `npm test -- --run src/data/validate.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add package.json vite.config.ts tsconfig.json index.html src
git commit -m "feat: scaffold dashboard data model"
```

### Task 2: 图片提取与结构化数据

**Files:**
- Create: `scripts/extract-source-images.mjs`
- Create: `scripts/validate-content.mjs`
- Create: `src/data/soul-rings.json`
- Create: `src/data/market-items.json`
- Create: `src/data/range-prices.json`
- Create: `src/data/content.test.ts`
- Create: `docs/data-review.md`

**Interfaces:**
- Consumes: Task 1 的 `Dataset` 字段约定。
- Produces: 三个可直接导入的 JSON 数据集；`npm run validate:data` 数据检查命令。

- [ ] **Step 1: 写内容完整性失败测试**

测试每条魂环都有名称、年限、属性、出处和置信状态；普通物价至少有一种非空计价；暗器/戒指记录包含区间和 `displayPrice`；所有 ID 唯一。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/data/content.test.ts`
Expected: FAIL，因为 JSON 数据尚未建立。

- [ ] **Step 3: 切片原图并生成 OCR 辅助稿**

`scripts/extract-source-images.mjs` 接受两张原始图片路径，将长表按行段输出到 `artifacts/ocr/`，供放大识别；不把 OCR 输出直接视为已核对数据。

- [ ] **Step 4: 整理魂环和物价 JSON**

按原图列结构录入三份 JSON；每个疑似错字或模糊数字设置 `confidence: "needs-review"`，并在 `docs/data-review.md` 列出对应 ID、原图区域和疑点。

- [ ] **Step 5: 实现并运行内容校验**

Run: `npm run validate:data && npm test -- --run src/data/content.test.ts`
Expected: 两条命令均 PASS；输出记录总数和待核对数。

- [ ] **Step 6: 提交**

```bash
git add scripts src/data docs/data-review.md package.json
git commit -m "data: extract soul ring and market records"
```

### Task 3: 搜索筛选逻辑与两个资料模块

**Files:**
- Create: `src/lib/filter.ts`
- Create: `src/lib/filter.test.ts`
- Create: `src/components/ModuleTabs.tsx`
- Create: `src/components/FilterBar.tsx`
- Create: `src/components/SoulRingModule.tsx`
- Create: `src/components/MarketModule.tsx`
- Create: `src/components/RangePriceTable.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Task 1 类型与 Task 2 JSON。
- Produces: `filterSoulRings(records, query, filters)`、`filterMarketItems(records, query, filters)`，以及两个可切换模块。

- [ ] **Step 1: 写筛选逻辑失败测试**

覆盖空白标准化、名称搜索、多个条件取交集、清除筛选、缺失计价方式筛除和待核对记录不丢失。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/lib/filter.test.ts`
Expected: FAIL，因为筛选函数尚不存在。

- [ ] **Step 3: 实现筛选函数**

在 `src/lib/filter.ts` 实现纯函数，中文搜索使用 `trim()` 后的包含匹配；条件集合为空时不限制对应字段。

- [ ] **Step 4: 构建两个模块**

魂环模块包含名称搜索、年限、属性、出处筛选；物价模块包含名称、分类、计价方式筛选，并在独立区块展示暗器/戒指区间价格。

- [ ] **Step 5: 运行单元与组件测试**

Run: `npm test -- --run`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src
git commit -m "feat: add searchable soul ring and price modules"
```

### Task 4: 玄幻视觉、响应式与无障碍

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/app.css`
- Create: `public/favicon.svg`
- Create: `tests/dashboard.spec.ts`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 3 的模块组件。
- Produces: 桌面数据表、移动卡片布局、全站主题与可访问交互。

- [ ] **Step 1: 写端到端失败测试**

测试模块切换、搜索结果、清除筛选、暗器区间可见、无结果空状态、待核对标识、键盘焦点，以及 390px 宽度无页面级横向溢出。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npx playwright test tests/dashboard.spec.ts`
Expected: FAIL，因为主题和响应式行为尚未完成。

- [ ] **Step 3: 应用主题与响应式布局**

使用墨黑/深靛背景、金色强调色和分级色带；桌面显示数据表，移动端显示卡片；所有按钮、输入和筛选控件提供可见焦点。

- [ ] **Step 4: 添加元数据和 favicon**

设置中文标题、描述和自包含 SVG favicon，不添加未请求的社交分享图。

- [ ] **Step 5: 运行端到端与生产构建**

Run: `npx playwright test && npm run build`
Expected: 全部 PASS，且 `dist/` 成功生成。

- [ ] **Step 6: 提交**

```bash
git add src public index.html tests
git commit -m "feat: polish responsive fantasy dashboard"
```

### Task 5: 数据复核、发布与线上验收

**Files:**
- Modify: `src/data/*.json`
- Modify: `docs/data-review.md`
- Create: `.openai/hosting.json`
- Create: `README.md`

**Interfaces:**
- Consumes: Task 2 的复核清单和 Task 4 的静态构建。
- Produces: 公开 HTTPS 网站地址和可重复发布配置。

- [ ] **Step 1: 对照原图复核高风险字段**

逐项检查价格数字、单位、年限、专有名词和区间边界；能确认的条目改为 `verified`，仍模糊的条目继续保留 `needs-review`。

- [ ] **Step 2: 运行完整验证**

Run: `npm run validate:data && npm test -- --run && npx playwright test && npm run build`
Expected: 全部 PASS，且输出最终记录总数、待核对数和 `dist/`。

- [ ] **Step 3: 配置静态托管**

在 `.openai/hosting.json` 指定 `dist` 为静态目录；`README.md` 记录本地预览、数据修订和重新发布方法。

- [ ] **Step 4: 发布并检查线上页面**

发布 `dist/`，打开公开 HTTPS 地址，检查两个模块、一次魂环搜索、一次物价筛选和 390px 移动视口。

- [ ] **Step 5: 提交**

```bash
git add src/data docs/data-review.md .openai/hosting.json README.md
git commit -m "chore: prepare dashboard for publication"
```
