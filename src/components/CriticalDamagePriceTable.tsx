import type { CriticalDamagePriceRecord } from "../types";

export function CriticalDamagePriceTable({ records, category }: { records: CriticalDamagePriceRecord[]; category: "徽章" | "魂导器" }) {
  const filtered = records.filter((item) => item.category === category);
  const slotGroups = category === "魂导器" ? (["三孔", "四孔", "五孔"] as const) : ([null] as const);

  return (
    <section className="range-section critical-price-section">
      <div className="subheading"><div><p className="eyebrow">CRITICAL DAMAGE PRICING</p><h3>{category}爆伤价格</h3></div><p>爆伤属性对应点券价格</p></div>
      <div className="data-shell">
        <table aria-label={`${category}爆伤点券价格`}>
          <thead><tr>{category === "魂导器" && <th>孔位</th>}<th>爆伤</th><th>点券价格</th></tr></thead>
          <tbody>{slotGroups.flatMap((slots) => {
            const group = filtered.filter((item) => item.slots === slots);
            return group.map((item, index) => (
              <tr key={item.id}>
                {category === "魂导器" && index === 0 && <th scope="rowgroup" rowSpan={group.length}>{slots}</th>}
                <td data-label="爆伤"><b>{item.criticalDamage}%</b></td>
                <td data-label="点券价格">{item.points}</td>
              </tr>
            ));
          })}</tbody>
        </table>
      </div>
    </section>
  );
}
