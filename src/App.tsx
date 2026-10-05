import { useState } from "react";
import soulRingData from "./data/soul-rings.json";
import marketData from "./data/market-items.json";
import rangeData from "./data/range-prices.json";
import soulDeviceData from "./data/soul-devices.json";
import soulBoneData from "./data/soul-bones.json";
import badgeData from "./data/badges.json";
import criticalDamagePriceData from "./data/critical-damage-prices.json";
import type { CriticalDamagePriceRecord, EquipmentAttributeRecord, MarketItem, RangePriceRecord, SoulRingRecord } from "./types";
import { MarketModule } from "./components/MarketModule";
import { ModuleTabs } from "./components/ModuleTabs";
import { EquipmentAttributeModule } from "./components/EquipmentAttributeModule";

const soulRings = soulRingData as SoulRingRecord[];
const marketItems = marketData as MarketItem[];
const rangePrices = rangeData as RangePriceRecord[];
const soulDevices = soulDeviceData as EquipmentAttributeRecord[];
const soulBones = soulBoneData as EquipmentAttributeRecord[];
const badges = badgeData as EquipmentAttributeRecord[];
const criticalDamagePrices = criticalDamagePriceData as CriticalDamagePriceRecord[];

export default function App() {
  const [active, setActive] = useState<"rings" | "market">("rings");
  const equipmentCount = soulRings.length + soulDevices.length + soulBones.length + badges.length;
  const reviewCount = [...soulRings, ...soulDevices, ...soulBones, ...badges, ...marketItems, ...rangePrices].filter((item) => item.confidence === "needs-review").length;
  return (
    <div className="app-shell">
      <div className="developer-credit" aria-label="开发者署名">
        <span aria-hidden="true">✦</span> 本程序由股神开发 <span aria-hidden="true">✦</span>
      </div>
      <header className="site-header">
        <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
        <div><p className="eyebrow">DOULUO DATA CODEX</p><h1>装备 · 万象录</h1><p>装备属性与一区物价的可检索资料库</p></div>
        <div className="header-stats"><span><b>{equipmentCount + marketItems.length + rangePrices.length + criticalDamagePrices.length}</b> 条资料</span><span><b>{reviewCount}</b> 待核对</span></div>
      </header>
      <ModuleTabs active={active} onChange={setActive} equipmentCount={equipmentCount} marketCount={marketItems.length + rangePrices.length + criticalDamagePrices.length} />
      <main>
        <div hidden={active !== "rings"}><EquipmentAttributeModule soulRings={soulRings} soulDevices={soulDevices} soulBones={soulBones} badges={badges} /></div>
        <div hidden={active !== "market"}><MarketModule records={marketItems} ranges={rangePrices} criticalPrices={criticalDamagePrices} attributeRecords={[...soulDevices, ...badges]} /></div>
      </main>
      <footer><p>数据整理自用户提供图片 · 物价记录时间：2026.8</p><p>“待核对”表示原图文字较小或识别置信度不足。</p></footer>
    </div>
  );
}
