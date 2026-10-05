import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../src/data/", import.meta.url);
const read = async (name) => JSON.parse(await readFile(new URL(name, root), "utf8"));
const [soulRings, marketItems, rangePrices, soulDevices, soulBones, badges, criticalDamagePrices, lockedHash] = await Promise.all([
  read("soul-rings.json"),
  read("market-items.json"),
  read("range-prices.json"),
  read("soul-devices.json"),
  read("soul-bones.json"),
  read("badges.json"),
  read("critical-damage-prices.json"),
  readFile(new URL("locked-soul-rings.sha256", root), "utf8")
]);

const allEquipment = [...soulDevices, ...soulBones, ...badges];
const all = [...soulRings, ...marketItems, ...rangePrices, ...allEquipment, ...criticalDamagePrices];
const ids = new Set(all.map((record) => record.id));
if (ids.size !== all.length) throw new Error("数据 ID 存在重复");
const soulRingBytes = await readFile(new URL("soul-rings.json", root));
const actualHash = createHash("sha256").update(soulRingBytes).digest("hex");
if (soulRings.length !== 258 || actualHash !== lockedHash.trim()) throw new Error("锁定的魂环资料发生变化");
if (soulRings.some((record) => !record.name || !record.years || !record.source || !record.attributes?.length)) {
  throw new Error("魂环资料存在缺失字段");
}
if (marketItems.some((record) => record.points == null && record.dragonGold == null && record.coins == null)) {
  throw new Error("物价资料存在无价格条目");
}
if (rangePrices.some((record) => !record.attributeRange || !record.displayPrice)) {
  throw new Error("区间价格存在缺失字段");
}
if (soulDevices.length !== 41 || soulBones.length !== 57 || badges.length !== 23) {
  throw new Error("装备属性资料行数与原图不一致");
}
if (allEquipment.some((record) => !record.name || !record.subtype || !record.attributes?.length || !["verified", "needs-review"].includes(record.confidence))) {
  throw new Error("装备属性资料存在缺失字段");
}
if (allEquipment.some((record) => record.confidence === "needs-review" && !record.sourceNote)) {
  throw new Error("待核对装备属性缺少说明");
}
if (criticalDamagePrices.length !== 24 || criticalDamagePrices.some((record) => !["徽章", "魂导器"].includes(record.category) || !Number.isFinite(record.criticalDamage) || !Number.isFinite(record.points))) {
  throw new Error("爆伤价格资料不完整");
}
if (criticalDamagePrices.some((record) => record.slots === "一孔" || record.slots === "二孔")) {
  throw new Error("魂导器一孔、两孔不得录入价格");
}

const needsReview = all.filter((record) => record.confidence === "needs-review").length;
console.log(`数据校验通过：锁定魂环 ${soulRings.length}，魂导器 ${soulDevices.length}，魂骨 ${soulBones.length}，徽章 ${badges.length}，爆伤价格 ${criticalDamagePrices.length}，待核对 ${needsReview}`);
