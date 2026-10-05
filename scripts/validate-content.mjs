import { readFile } from "node:fs/promises";

const root = new URL("../src/data/", import.meta.url);
const read = async (name) => JSON.parse(await readFile(new URL(name, root), "utf8"));
const [soulRings, marketItems, rangePrices] = await Promise.all([
  read("soul-rings.json"),
  read("market-items.json"),
  read("range-prices.json")
]);

const all = [...soulRings, ...marketItems, ...rangePrices];
const ids = new Set(all.map((record) => record.id));
if (ids.size !== all.length) throw new Error("数据 ID 存在重复");
if (soulRings.some((record) => !record.name || !record.years || !record.source || !record.attributes?.length)) {
  throw new Error("魂环资料存在缺失字段");
}
if (marketItems.some((record) => record.points == null && record.dragonGold == null && record.coins == null)) {
  throw new Error("物价资料存在无价格条目");
}
if (rangePrices.some((record) => !record.attributeRange || !record.displayPrice)) {
  throw new Error("区间价格存在缺失字段");
}

const needsReview = all.filter((record) => record.confidence === "needs-review").length;
console.log(`数据校验通过：魂环 ${soulRings.length}，物价 ${marketItems.length}，区间价格 ${rangePrices.length}，待核对 ${needsReview}`);
