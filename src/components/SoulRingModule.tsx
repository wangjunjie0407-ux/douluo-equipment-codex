import { useMemo, useState } from "react";
import type { SoulRingRecord } from "../types";
import { filterSoulRings } from "../lib/filter";
import { FilterBar } from "./FilterBar";

const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b, "zh-CN"));

export function SoulRingModule({ records }: { records: SoulRingRecord[] }) {
  const [query, setQuery] = useState("");
  const [years, setYears] = useState("");
  const [attribute, setAttribute] = useState("");
  const [source, setSource] = useState("");
  const yearOptions = useMemo(() => unique(records.map((item) => item.years)), [records]);
  const sourceOptions = useMemo(() => unique(records.map((item) => item.source)), [records]);
  const attributeOptions = useMemo(() => unique(records.flatMap((item) => item.attributes.map((value) => value.replace(/[\d.%]+.*$/, "")).filter(Boolean))), [records]);
  const filtered = filterSoulRings(records, query, { years, attribute, source });
  const clear = () => { setQuery(""); setYears(""); setAttribute(""); setSource(""); };

  return (
    <section className="module-panel" aria-labelledby="rings-title">
      <div className="section-heading"><div><p className="eyebrow">SOUL RING ARCHIVE</p><h2 id="rings-title">魂环资料库</h2></div><strong>{filtered.length}<span> / {records.length}</span></strong></div>
      <FilterBar label="搜索魂环" value={query} placeholder="名称、属性或出处" onChange={setQuery} onClear={clear}>
        <label><span>年限</span><select value={years} onChange={(event) => setYears(event.target.value)}><option value="">全部年限</option>{yearOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>属性</span><select value={attribute} onChange={(event) => setAttribute(event.target.value)}><option value="">全部属性</option>{attributeOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>出处</span><select value={source} onChange={(event) => setSource(event.target.value)}><option value="">全部出处</option>{sourceOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
      </FilterBar>
      {filtered.length === 0 ? <div className="empty"><p>没有找到匹配的魂环</p><button onClick={clear}>清除筛选</button></div> : (
        <div className="data-shell">
          <table><thead><tr><th>魂环名字</th><th>年限</th><th>属性</th><th>出处</th><th>状态</th></tr></thead>
            <tbody>{filtered.map((item) => <tr key={item.id}><td data-label="魂环名字"><b>{item.name}</b></td><td data-label="年限"><span className={`tier tier-${item.yearTier}`}>{item.years}</span></td><td data-label="属性"><div className="chips">{item.attributes.map((value) => <span key={value}>{value}</span>)}</div></td><td data-label="出处">{item.source}</td><td data-label="状态">{item.confidence === "needs-review" ? <span className="review">待核对</span> : <span className="verified">已整理</span>}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
