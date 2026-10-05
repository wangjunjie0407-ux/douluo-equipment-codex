import type { Confidence, Dataset } from "../types";

const confidences = new Set<Confidence>(["verified", "needs-review"]);

function requiredString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} must be a non-empty string`);
  }
}

function assertConfidence(value: unknown): asserts value is Confidence {
  if (!confidences.has(value as Confidence)) {
    throw new Error("confidence must be verified or needs-review");
  }
}

export function validateDataset(input: unknown): Dataset {
  if (!input || typeof input !== "object") throw new Error("dataset must be an object");
  const data = input as Dataset;
  requiredString(data.meta?.title, "meta.title");
  requiredString(data.meta?.dateLabel, "meta.dateLabel");
  if (!Array.isArray(data.soulRings) || !Array.isArray(data.marketItems) || !Array.isArray(data.rangePrices)) {
    throw new Error("dataset collections must be arrays");
  }
  data.soulRings.forEach((record, index) => {
    requiredString(record.id, `soulRings[${index}].id`);
    requiredString(record.name, `soulRings[${index}].name`);
    requiredString(record.years, `soulRings[${index}].years`);
    requiredString(record.source, `soulRings[${index}].source`);
    if (!Array.isArray(record.attributes) || record.attributes.length === 0) throw new Error(`soulRings[${index}].attributes required`);
    assertConfidence(record.confidence);
  });
  data.marketItems.forEach((record, index) => {
    requiredString(record.id, `marketItems[${index}].id`);
    requiredString(record.name, `marketItems[${index}].name`);
    requiredString(record.category, `marketItems[${index}].category`);
    assertConfidence(record.confidence);
  });
  data.rangePrices.forEach((record, index) => {
    requiredString(record.id, `rangePrices[${index}].id`);
    requiredString(record.attributeRange, `rangePrices[${index}].attributeRange`);
    requiredString(record.displayPrice, `rangePrices[${index}].displayPrice`);
    assertConfidence(record.confidence);
  });
  return data;
}
