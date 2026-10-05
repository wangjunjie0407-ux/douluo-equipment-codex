import type { EquipmentAttributeRecord, MarketItem, SoulRingRecord } from "../types";

export interface SoulRingFilters {
  years?: string;
  attribute?: string;
  source?: string;
}

export interface MarketFilters {
  category?: string;
  currency?: "points" | "dragonGold" | "coins" | "";
}

export interface EquipmentFilters {
  subtype?: string;
  source?: string;
}

const normalize = (value = "") => value.trim().toLocaleLowerCase("zh-CN");

export function filterSoulRings(records: SoulRingRecord[], query: string, filters: SoulRingFilters) {
  const term = normalize(query);
  return records.filter((record) => {
    const matchesQuery = !term || normalize(`${record.name} ${record.attributes.join(" ")} ${record.source}`).includes(term);
    const matchesYears = !filters.years || record.years === filters.years;
    const matchesAttribute = !filters.attribute || record.attributes.some((attribute) => attribute.includes(filters.attribute!));
    const matchesSource = !filters.source || record.source === filters.source;
    return matchesQuery && matchesYears && matchesAttribute && matchesSource;
  });
}

export function filterMarketItems(records: MarketItem[], query: string, filters: MarketFilters) {
  const term = normalize(query);
  return records.filter((record) => {
    const matchesQuery = !term || normalize(`${record.name} ${record.category}`).includes(term);
    const matchesCategory = !filters.category || record.category === filters.category;
    const matchesCurrency = !filters.currency || record[filters.currency] !== null;
    return matchesQuery && matchesCategory && matchesCurrency;
  });
}

export function filterEquipmentRecords(records: EquipmentAttributeRecord[], query: string, filters: EquipmentFilters) {
  const term = normalize(query);
  return records.filter((record) => {
    const matchesQuery = !term || normalize(`${record.name} ${record.subtype} ${record.source ?? ""} ${record.attributes.join(" ")}`).includes(term);
    const matchesSubtype = !filters.subtype || record.subtype === filters.subtype;
    const matchesSource = !filters.source || record.source === filters.source;
    return matchesQuery && matchesSubtype && matchesSource;
  });
}
