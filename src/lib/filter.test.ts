import { describe, expect, it } from "vitest";
import { filterEquipmentRecords, filterMarketItems, filterSoulRings } from "./filter";
import type { EquipmentAttributeRecord, MarketItem, SoulRingRecord } from "../types";

const rings: SoulRingRecord[] = [
  { id: "r1", name: "风狒狒", years: "十年", yearTier: "other", attributes: ["闪避3%", "攻击力14"], source: "斗魂森林", confidence: "verified" },
  { id: "r2", name: "狂化风狒狒", years: "狂化十年", yearTier: "other", attributes: ["闪避1%", "攻击力80"], source: "兽潮来袭", confidence: "needs-review" }
];

const market: MarketItem[] = [
  { id: "m1", name: "蓝银天青龙", category: "千万年", points: 1500, dragonGold: 500, coins: null, notes: null, confidence: "verified" },
  { id: "m2", name: "罗姆血源蛛精魄", category: "基础材料", points: null, dragonGold: null, coins: "5000", notes: null, confidence: "needs-review" }
];

const equipment: EquipmentAttributeRecord[] = [
  { id: "e1", kind: "soul-device", name: "灵魂撕裂者", subtype: "四孔", source: "抽奖区", attributes: ["攻击26000", "暴伤80%"], confidence: "verified" },
  { id: "e2", kind: "soul-device", name: "蛇年大吉", subtype: "一孔", source: "活动", attributes: ["攻击8888", "经验10%"], confidence: "verified" }
];

describe("filterSoulRings", () => {
  it("normalizes whitespace and searches names", () => {
    expect(filterSoulRings(rings, "  狂化 ", {}).map((item) => item.id)).toEqual(["r2"]);
  });

  it("intersects year, attribute and source filters", () => {
    expect(filterSoulRings(rings, "", { years: "十年", attribute: "闪避", source: "斗魂森林" }).map((item) => item.id)).toEqual(["r1"]);
  });

  it("returns all records when filters are empty", () => {
    expect(filterSoulRings(rings, "", {})).toHaveLength(2);
  });
});

describe("filterMarketItems", () => {
  it("filters by category and available currency", () => {
    expect(filterMarketItems(market, "", { category: "基础材料", currency: "coins" }).map((item) => item.id)).toEqual(["m2"]);
  });

  it("does not treat missing prices as zero", () => {
    expect(filterMarketItems(market, "", { currency: "points" }).map((item) => item.id)).toEqual(["m1"]);
  });
});

describe("filterEquipmentRecords", () => {
  it("searches names, source, subtype and attributes", () => {
    expect(filterEquipmentRecords(equipment, "  暴伤80% ", {}).map((item) => item.id)).toEqual(["e1"]);
  });

  it("intersects subtype and source filters", () => {
    expect(filterEquipmentRecords(equipment, "", { subtype: "一孔", source: "活动" }).map((item) => item.id)).toEqual(["e2"]);
  });
});
