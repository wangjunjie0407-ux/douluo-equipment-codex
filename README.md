# 装备 · 万象录

装备属性与一区装备物价的双模块可视化资料库。页面包含醒目的动态署名“本程序由股神开发”。

## 功能

- 装备属性库：魂环、魂导器、魂骨、徽章四类资料，可按名称、属性、出处与子类型检索。
- 装备物价表：普通物品的点券、龙金和金币价格，以及暗器、戒指属性区间价格。
- 爆伤价格：徽章 80–170 爆伤共 13 档；魂导器仅收录三孔、四孔、五孔共 11 档。
- 响应式布局：支持桌面和手机浏览。

## 本地运行

```powershell
pnpm install
pnpm dev
```

浏览器访问命令行中显示的本地地址。生产构建使用：

```powershell
pnpm build
```

## 数据修订

结构化资料位于 `src/data/`：

- `soul-rings.json`：魂环名称、年限、属性、出处。
- `soul-devices.json`：魂导器名称、出处、孔位与属性。
- `soul-bones.json`：魂骨名称、类型与属性。
- `badges.json`：徽章名称与属性（原图“盾牌”统一归类为“徽章”）。
- `market-items.json`：装备、魂环、材料与魂骨价格。
- `range-prices.json`：暗器与戒指的属性区间价格。
- `critical-damage-prices.json`：徽章与魂导器的爆伤点券价格。

原有 258 条魂环数据由 `locked-soul-rings.sha256` 锁定。验证脚本会检查其数量与内容哈希，防止新增资料时误改原数据。

修改后运行：

```powershell
pnpm validate:data
pnpm test -- --run
pnpm exec playwright test
pnpm build
```

本项目按要求仅保存到 GitHub 私有仓库，不包含网站发布或部署配置。
