import { useMemo, useState } from "react";
import { filterMarketItems } from "../lib/filter";
import type { CriticalDamagePriceRecord, MarketItem, RangePriceRecord } from "../types";
import { FilterBar } from "./FilterBar";
import { RangePriceTable } from "./RangePriceTable";
import { CriticalDamagePriceTable } from "./CriticalDamagePriceTable";

const price = (value: number | string | null, suffix: string) => value === null ? "—" : `${value}${suffix}`;

export function MarketModule({ records, ranges, criticalPrices }: { records: MarketItem[]; ranges: RangePriceRecord[]; criticalPrices: CriticalDamagePriceRecord[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState<"" | "points" | "dragonGold" | "coins">("");
  const categories = useMemo(() => [...new Set([...records.map((item) => item.category), ...ranges.map((item) => item.type), ...criticalPrices.map((item) => item.category)])], [records, ranges, criticalPrices]);
  const filtered = filterMarketItems(records, query, { category, currency });
  const criticalCategory = category === "徽章" || category === "魂导器" ? category : null;
  const showCriticalPricing = criticalCategory !== null && (currency === "" || currency === "points") && query === "";
  const clear = () => { setQuery(""); setCategory(""); setCurrency(""); };

  return (
    <section className="module-panel" aria-labelledby="market-title">
      <div className="section-heading"><div><p className="eyebrow">MARKET INDEX</p><h2 id="market-title">装备物价表</h2><p>一区物价表 · 2026.8</p></div><strong>{filtered.length}<span> / {records.length}</span></strong></div>
      <FilterBar label="搜索物品" value={query} placeholder="魂环、装备、材料或魂骨" onChange={setQuery} onClear={clear}>
        <label><span>分类</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">全部分类</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>计价</span><select value={currency} onChange={(event) => setCurrency(event.target.value as typeof currency)}><option value="">全部计价</option><option value="points">点券</option><option value="dragonGold">龙金</option><option value="coins">金币</option></select></label>
      </FilterBar>
      {filtered.length === 0 && !showCriticalPricing ? <div className="empty"><p>没有找到匹配的物品</p><button onClick={clear}>清除筛选</button></div> : filtered.length > 0 ? <div className="data-shell"><table><thead><tr><th>名称</th><th>分类</th><th>点券</th><th>龙金（组）</th><th>金币</th><th>状态</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td data-label="名称"><b>{item.name}</b></td><td data-label="分类"><span className="category">{item.category}</span></td><td data-label="点券">{price(item.points, "")}</td><td data-label="龙金（组）">{price(item.dragonGold, "")}</td><td data-label="金币">{price(item.coins, "")}</td><td data-label="状态">{item.confidence === "needs-review" ? <span className="review">待核对</span> : <span className="verified">已整理</span>}</td></tr>)}</tbody></table></div> : null}
      <RangePriceTable records={ranges} selectedCategory={category} />
      {showCriticalPricing && <CriticalDamagePriceTable records={criticalPrices} category={criticalCategory} />}
    </section>
  );
}
