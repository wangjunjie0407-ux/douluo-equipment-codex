# 魂环 · 万象录

魂环属性与一区装备物价的双模块可视化资料库。

## 本地运行

```powershell
pnpm install
pnpm dev
```

## 数据修订

结构化资料位于 `src/data/`：

- `soul-rings.json`：魂环名称、年限、属性、出处。
- `market-items.json`：装备、魂环、材料与魂骨价格。
- `range-prices.json`：暗器与戒指的属性区间价格。

修改后运行 `pnpm validate:data`、`pnpm test -- --run` 和 `pnpm build`。
