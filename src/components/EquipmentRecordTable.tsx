import type { EquipmentAttributeRecord } from "../types";

const typeLabel = (kind: EquipmentAttributeRecord["kind"]) => kind === "soul-device" ? "孔位" : kind === "soul-bone" ? "魂骨类型" : "徽章类型";

export function EquipmentRecordTable({ records }: { records: EquipmentAttributeRecord[] }) {
  if (records.length === 0) return null;
  const showSource = records[0].kind === "soul-device";
  return (
    <div className="data-shell equipment-data-shell">
      <table>
        <thead><tr><th>名称</th><th>{typeLabel(records[0].kind)}</th>{showSource && <th>出处</th>}<th>属性</th><th>状态</th></tr></thead>
        <tbody>{records.map((item) => <tr key={item.id}>
          <td data-label="名称"><b>{item.name}</b></td>
          <td data-label={typeLabel(item.kind)}><span className="category">{item.subtype}</span></td>
          {showSource && <td data-label="出处">{item.source}</td>}
          <td data-label="属性"><div className="chips equipment-attributes">{item.attributes.map((value) => <span key={value}>{value}</span>)}</div></td>
          <td data-label="状态">{item.confidence === "needs-review" ? <span className="review" title={item.sourceNote ?? "原图文字待核对"}>待核对</span> : <span className="verified">已整理</span>}</td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}
