import { useState } from "react";
import soulRingData from "./data/soul-rings.json";
import marketData from "./data/market-items.json";
import rangeData from "./data/range-prices.json";
import type { MarketItem, RangePriceRecord, SoulRingRecord } from "./types";
import { MarketModule } from "./components/MarketModule";
import { ModuleTabs } from "./components/ModuleTabs";
import { SoulRingModule } from "./components/SoulRingModule";

const soulRings = soulRingData as SoulRingRecord[];
const marketItems = marketData as MarketItem[];
const rangePrices = rangeData as RangePriceRecord[];

export default function App() {
  const [active, setActive] = useState<"rings" | "market">("rings");
  const reviewCount = [...soulRings, ...marketItems, ...rangePrices].filter((item) => item.confidence === "needs-review").length;
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
        <div><p className="eyebrow">DOULUO DATA CODEX</p><h1>魂环 · 万象录</h1><p>魂环属性与一区物价的可检索资料库</p></div>
        <div className="header-stats"><span><b>{soulRings.length + marketItems.length + rangePrices.length}</b> 条资料</span><span><b>{reviewCount}</b> 待核对</span></div>
      </header>
      <ModuleTabs active={active} onChange={setActive} ringCount={soulRings.length} marketCount={marketItems.length + rangePrices.length} />
      <main>
        <div hidden={active !== "rings"}><SoulRingModule records={soulRings} /></div>
        <div hidden={active !== "market"}><MarketModule records={marketItems} ranges={rangePrices} /></div>
      </main>
      <footer><p>数据整理自用户提供图片 · 物价记录时间：2026.8</p><p>“待核对”表示原图文字较小或识别置信度不足。</p></footer>
    </div>
  );
}
