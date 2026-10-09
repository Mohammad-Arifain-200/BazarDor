import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeProducts, normalizeCategories } from "../lib/catalog-schema.ts";
const products = JSON.parse(readFileSync(new URL("../data/products.json", import.meta.url), "utf8"));
const categories = JSON.parse(readFileSync(new URL("../data/categories.json", import.meta.url), "utf8"));

test("real supplied snapshot survives normalization unchanged", () => {
  assert.deepEqual(normalizeProducts(products), products);
  assert.deepEqual(normalizeCategories(categories), categories);
});
test("Bengali API numbers are normalized in both summaries and market data", () => {
  const item = structuredClone(products[0]);
  item.today = "১,৮৫০"; item.change.pct = "-২.৯"; item.change.dir = "down";
  item.markets[0].min = "১,৭০০"; item.markets[0].max = "১,৯০০";
  const [result] = normalizeProducts([item]);
  assert.equal(result.today, 1850); assert.equal(result.change.pct, -2.9);
  assert.equal(result.markets[0].min, 1700); assert.equal(result.markets[0].max, 1900);
});
test("bad upstream values throw instead of silently displaying a zero price", () => {
  for (const value of ["", "unknown", null, undefined, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => normalizeProducts([{ ...products[0], today: value }]));
  }
  assert.throws(() => normalizeProducts([{ ...products[0], change: { dir: "up", pct: "unknown" } }]));
});
test("duplicate IDs/slugs and invalid markets are rejected", () => {
  assert.throws(() => normalizeProducts([products[0], products[0]]));
  assert.throws(() => normalizeCategories([categories[0], categories[0]]));
  const item = structuredClone(products[0]); item.markets[0].min = item.markets[0].max + 1;
  assert.throws(() => normalizeProducts([item]));
  assert.throws(() => normalizeCategories([{ slug: "chal", nameBn: "চাল", icon: "🍚" }]));
});
