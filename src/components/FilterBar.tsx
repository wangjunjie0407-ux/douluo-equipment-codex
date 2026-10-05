import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onClear: () => void;
  children?: ReactNode;
}

export function FilterBar({ label, value, placeholder, onChange, onClear, children }: Props) {
  return (
    <section className="filter-bar" aria-label="筛选条件">
      <label className="search-field">
        <span>{label}</span>
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      </label>
      {children}
      <button className="clear-button" aria-label="重置全部筛选" onClick={onClear}>清除筛选</button>
    </section>
  );
}
