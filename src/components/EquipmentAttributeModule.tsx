import { useMemo, useState } from "react";
import type { EquipmentAttributeRecord, SoulRingRecord } from "../types";
import { filterEquipmentRecords } from "../lib/filter";
import { EquipmentRecordTable } from "./EquipmentRecordTable";
import { FilterBar } from "./FilterBar";
import { SoulRingModule } from "./SoulRingModule";

type Category = "rings" | "devices" | "bones" | "badges";
const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b, "zh-CN"));

function EquipmentCategoryPanel({ label, records }: { label: string; records: EquipmentAttributeRecord[] }) {
  const [query, setQuery] = useState("");
  const [subtype, setSubtype] = useState("");
  const [source, setSource] = useState("");
  const subtypes = useMemo(() => unique(records.map((item) => item.subtype)), [records]);
  const sources = useMemo(() => unique(records.flatMap((item) => item.source ? [item.source] : [])), [records]);
  const filtered = filterEquipmentRecords(records, query, { subtype, source });
  const clear = () => { setQuery(""); setSubtype(""); setSource(""); };
  return (
    <section aria-label={`${label}属性`}>
      <div className="subcategory-heading"><h3>{label}属性</h3><strong>{filtered.length}<span> / {records.length}</span></strong></div>
      <FilterBar label={`搜索${label}`} value={query} placeholder="名称、属性或出处" onChange={setQuery} onClear={clear}>
        <label><span>{label === "魂导器" ? "孔位" : label === "魂骨" ? "魂骨类型" : "徽章类型"}</span><select value={subtype} onChange={(event) => setSubtype(event.target.value)}><option value="">全部类型</option>{subtypes.map((value) => <option key={value}>{value}</option>)}</select></label>
        {sources.length > 0 && <label><span>出处</span><select value={source} onChange={(event) => setSource(event.target.value)}><option value="">全部出处</option>{sources.map((value) => <option key={value}>{value}</option>)}</select></label>}
      </FilterBar>
      {filtered.length === 0 ? <div className="empty"><p>没有找到匹配的{label}</p><button onClick={clear}>清除筛选</button></div> : <EquipmentRecordTable records={filtered} />}
    </section>
  );
}

export function EquipmentAttributeModule({ soulRings, soulDevices, soulBones, badges }: { soulRings: SoulRingRecord[]; soulDevices: EquipmentAttributeRecord[]; soulBones: EquipmentAttributeRecord[]; badges: EquipmentAttributeRecord[] }) {
  const [active, setActive] = useState<Category>("rings");
  const tabs: Array<{ id: Category; label: string; count: number }> = [
    { id: "rings", label: "魂环", count: soulRings.length },
    { id: "devices", label: "魂导器", count: soulDevices.length },
    { id: "bones", label: "魂骨", count: soulBones.length },
    { id: "badges", label: "徽章", count: badges.length }
  ];
  return (
    <section className="module-panel" aria-labelledby="equipment-library-title">
      <div className="section-heading"><div><p className="eyebrow">EQUIPMENT ATTRIBUTE ARCHIVE</p><h2 id="equipment-library-title">装备属性库</h2></div><strong>{tabs.find((tab) => tab.id === active)?.count}<span> 条</span></strong></div>
      <nav className="attribute-tabs" aria-label="装备属性分类">{tabs.map((tab) => <button key={tab.id} aria-label={`${tab.label} ${tab.count}`} className={active === tab.id ? "active" : ""} aria-pressed={active === tab.id} onClick={() => setActive(tab.id)}><span>{tab.label}</span><small>{tab.count}</small></button>)}</nav>
      <div hidden={active !== "rings"}><SoulRingModule records={soulRings} embedded /></div>
      <div hidden={active !== "devices"}><EquipmentCategoryPanel label="魂导器" records={soulDevices} /></div>
      <div hidden={active !== "bones"}><EquipmentCategoryPanel label="魂骨" records={soulBones} /></div>
      <div hidden={active !== "badges"}><EquipmentCategoryPanel label="徽章" records={badges} /></div>
    </section>
  );
}
