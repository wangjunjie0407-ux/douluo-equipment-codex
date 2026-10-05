export type Confidence = "verified" | "needs-review";
export type YearTier = "10k" | "100k" | "1m" | "10m" | "100m" | "other";

export interface SoulRingRecord {
  id: string;
  name: string;
  years: string;
  yearTier: YearTier;
  attributes: string[];
  source: string;
  confidence: Confidence;
  sourceNote?: string | null;
}

export interface MarketItem {
  id: string;
  name: string;
  category: string;
  points: number | null;
  dragonGold: number | null;
  coins: string | null;
  notes: string | null;
  confidence: Confidence;
}

export interface RangePriceRecord {
  id: string;
  type: "暗器" | "戒指";
  attributeRange: string;
  minPrice: number | null;
  maxPrice: number | null;
  displayPrice: string;
  confidence: Confidence;
}

export type EquipmentAttributeKind = "soul-device" | "soul-bone" | "badge";

export interface EquipmentAttributeRecord {
  id: string;
  kind: EquipmentAttributeKind;
  name: string;
  subtype: string;
  source: string | null;
  attributes: string[];
  confidence: Confidence;
  sourceNote?: string | null;
}

export interface CriticalDamagePriceRecord {
  id: string;
  category: "徽章" | "魂导器";
  slots: "三孔" | "四孔" | "五孔" | null;
  criticalDamage: number;
  points: number;
}

export interface DatasetMeta {
  title: string;
  dateLabel: string;
}

export interface Dataset {
  meta: DatasetMeta;
  soulRings: SoulRingRecord[];
  marketItems: MarketItem[];
  rangePrices: RangePriceRecord[];
}
