import { describe, expect, it } from "vitest";
import soulRings from "./soul-rings.json";
import marketItems from "./market-items.json";
import rangePrices from "./range-prices.json";

describe("extracted content", () => {
  it("keeps required soul-ring fields and unique ids", () => {
    expect(soulRings.length).toBeGreaterThan(0);
    expect(new Set(soulRings.map((item) => item.id)).size).toBe(soulRings.length);
    soulRings.forEach((item) => {
      expect(item.name).toBeTruthy();
      expect(item.years).toBeTruthy();
      expect(item.attributes.length).toBeGreaterThan(0);
      expect(item.source).toBeTruthy();
      expect(["verified", "needs-review"]).toContain(item.confidence);
    });
  });

  it("requires at least one price on every market item", () => {
    expect(marketItems.length).toBeGreaterThan(0);
    marketItems.forEach((item) => {
      expect(item.points !== null || item.dragonGold !== null || item.coins !== null).toBe(true);
    });
  });

  it("keeps every range linked to a display price", () => {
    expect(rangePrices.length).toBeGreaterThan(0);
    rangePrices.forEach((item) => {
      expect(item.attributeRange).toBeTruthy();
      expect(item.displayPrice).toBeTruthy();
    });
  });
});
