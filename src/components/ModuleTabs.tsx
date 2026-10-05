interface Props {
  active: "rings" | "market";
  onChange: (tab: "rings" | "market") => void;
  equipmentCount: number;
  marketCount: number;
}

export function ModuleTabs({ active, onChange, equipmentCount, marketCount }: Props) {
  return (
    <nav className="module-tabs" aria-label="资料模块">
      <button className={active === "rings" ? "active" : ""} aria-pressed={active === "rings"} onClick={() => onChange("rings")}>
        <span>装备属性库</span><small>{equipmentCount} 条</small>
      </button>
      <button className={active === "market" ? "active" : ""} aria-pressed={active === "market"} onClick={() => onChange("market")}>
        <span>装备物价表</span><small>{marketCount} 条</small>
      </button>
    </nav>
  );
}
