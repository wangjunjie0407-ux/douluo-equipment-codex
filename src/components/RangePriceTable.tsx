import type { RangePriceRecord } from "../types";

export function RangePriceTable({ records }: { records: RangePriceRecord[] }) {
  return (
    <section className="range-section">
      <div className="subheading"><div><p className="eyebrow">ATTRIBUTE PRICING</p><h3>属性区间价格</h3></div><p>暗器与戒指按属性区间对应点券价格</p></div>
      <div className="range-grid">{(["暗器", "戒指"] as const).map((type) => <article key={type}><h4>{type}</h4><div>{records.filter((item) => item.type === type).map((item) => <p key={item.id}><span>{item.attributeRange}</span><strong>{item.displayPrice}</strong>{item.confidence === "needs-review" && <i>待核对</i>}</p>)}</div></article>)}</div>
    </section>
  );
}
