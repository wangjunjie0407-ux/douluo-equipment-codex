import { describe, expect, it } from "vitest";
import { validateDataset } from "./validate";

const validDataset = {
  meta: { title: "一区物价表", dateLabel: "2026.8" },
  soulRings: [{
    id: "ring-1",
    name: "死亡蛛皇",
    years: "十万年",
    yearTier: "100k",
    attributes: ["强攻"],
    source: "斗罗大陆",
    confidence: "verified"
  }],
  marketItems: [{
    id: "item-1",
    name: "死镰/木桩精",
    category: "十万年",
    points: 10,
    dragonGold: 1,
    coins: null,
    notes: null,
    confidence: "verified"
  }],
  rangePrices: [{
    id: "range-1",
    type: "暗器",
    attributeRange: "爆伤 100–120",
    minPrice: 100,
    maxPrice: 200,
    displayPrice: "100–200 点券",
    confidence: "verified"
  }]
};

describe("validateDataset", () => {
  it("accepts a complete dataset and preserves null prices", () => {
    const result = validateDataset(validDataset);
    expect(result.marketItems[0].coins).toBeNull();
  });

  it("preserves range wording instead of collapsing it", () => {
    const withApproximation = structuredClone(validDataset);
    withApproximation.rangePrices[0].displayPrice = "1500左右";
    expect(validateDataset(withApproximation).rangePrices[0].displayPrice).toBe("1500左右");
  });

  it("accepts needs-review confidence", () => {
    const uncertain = structuredClone(validDataset);
    uncertain.soulRings[0].confidence = "needs-review";
    expect(validateDataset(uncertain).soulRings[0].confidence).toBe("needs-review");
  });

  it("rejects records missing required names", () => {
    const invalid = structuredClone(validDataset);
    delete (invalid.soulRings[0] as { name?: string }).name;
    expect(() => validateDataset(invalid)).toThrow(/name/i);
  });
});
