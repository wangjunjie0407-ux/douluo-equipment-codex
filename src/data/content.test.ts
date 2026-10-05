import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import soulRings from "./soul-rings.json";
import marketItems from "./market-items.json";
import rangePrices from "./range-prices.json";
import soulDevices from "./soul-devices.json";
import soulBones from "./soul-bones.json";
import badges from "./badges.json";
import criticalDamagePrices from "./critical-damage-prices.json";

describe("extracted content", () => {
  it("keeps the locked soul-ring dataset unchanged", () => {
    const bytes = readFileSync("src/data/soul-rings.json");
    expect(soulRings).toHaveLength(258);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe("f26d0fe2a8fd911d64d9793276c2d20555f69f22cd729aeff77d68d620663af8");
  });

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

  it("loads all visual rows for each new equipment category", () => {
    expect(soulDevices).toHaveLength(41);
    expect(soulBones).toHaveLength(57);
    expect(badges).toHaveLength(23);
    for (const item of [...soulDevices, ...soulBones, ...badges]) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.subtype).toBeTruthy();
      expect(item.attributes.length).toBeGreaterThan(0);
      expect(["verified", "needs-review"]).toContain(item.confidence);
      if (item.confidence === "needs-review") expect(item.sourceNote).toBeTruthy();
    }
  });

  it("preserves representative source attributes verbatim", () => {
    expect(soulDevices[0]).toMatchObject({ name: "蛇年大吉", source: "活动", subtype: "一孔", attributes: ["攻击8888", "经验10%"] });
    expect(soulDevices.at(-1)).toMatchObject({ name: "普天祥瑞", subtype: "五孔" });
    expect(soulBones[0]).toMatchObject({ name: "帝天头骨", subtype: "头骨" });
    expect(soulBones.at(-1)).toMatchObject({ name: "银妖藤骨", subtype: "所有", attributes: ["生命1100", "攻击150", "缓慢4", "凋零4"] });
    expect(badges[0]).toMatchObject({ name: "魔法深渊之章", subtype: "徽章", attributes: ["失明10%", "点燃10%", "移速10%", "缓慢10%", "暴伤30%", "攻击6000"] });
    expect(badges.at(-1)).toMatchObject({ name: "黑暗大帝的纹章", subtype: "徽章" });
  });

  it("contains the exact approved critical-damage price ladders", () => {
    const badge = criticalDamagePrices.filter((item) => item.category === "徽章").map(({ criticalDamage, points }) => [criticalDamage, points]);
    const devices = criticalDamagePrices.filter((item) => item.category === "魂导器").map(({ slots, criticalDamage, points }) => [slots, criticalDamage, points]);
    expect(badge).toEqual([[80,500],[85,550],[90,700],[95,800],[100,1000],[110,1500],[120,1800],[130,2000],[140,2500],[150,3000],[160,3500],[166,4000],[170,5000]]);
    expect(devices).toEqual([["三孔",50,2500],["三孔",55,2600],["三孔",60,2700],["三孔",65,2800],["三孔",68,2900],["三孔",70,3000],["四孔",80,5500],["四孔",85,6000],["四孔",90,6500],["五孔",95,11000],["五孔",100,12000]]);
    expect(criticalDamagePrices.some((item) => item.slots === "一孔" || item.slots === "二孔")).toBe(false);
  });
});
