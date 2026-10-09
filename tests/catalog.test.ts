import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { numericPrice, bn, banglaDate, unitLabel } from "../lib/format.ts";
import { sortProducts, movers, marketStats } from "../lib/catalog-utils.ts";
import type { Product } from "../lib/types.ts";
const products: Product[] = JSON.parse(readFileSync(new URL("../data/products.json", import.meta.url), "utf8"));
const categories = JSON.parse(readFileSync(new URL("../data/categories.json", import.meta.url), "utf8")) as { id: string }[];
test("supplied data contains 33 unique products and all eight categories", () => {
  assert.equal(products.length, 33); assert.equal(new Set(products.map(p => p.slug)).size, 33);
  assert.equal(categories.length, 8); assert.equal(new Set(categories.map(c => c.id)).size, 8);
  for (const p of products) { assert.ok(categories.some(c => c.id === p.category)); assert.equal(p.markets.length, 12); assert.ok(p.markets.every(m => m.min <= m.max)); }
});
test("Bengali comma-separated prices are converted before sorting", () => {
  assert.equal(numericPrice("১,৮৫০"), 1850); assert.equal(numericPrice("৬৫.৫০"), 65.5);
  const input = [{ ...products[0], today: "৯৯" }, { ...products[1], today: "১,৮৫০" }, { ...products[2], today: "১৪৮" }] as unknown as Product[];
  assert.deepEqual(sortProducts(input, "asc").map(p => p.today), ["৯৯", "১৪৮", "১,৮৫০"]);
  assert.deepEqual(sortProducts(input, "desc").map(p => p.today), ["১,৮৫০", "১৪৮", "৯৯"]);
  assert.deepEqual(input.map(p => p.today), ["৯৯", "১,৮৫০", "১৪৮"]);
});
test("default sorting preserves the API order and ascending/descending handle all products", () => {
  const original = products.map(p => p.id);
  assert.deepEqual(sortProducts(products, "default").map(p => p.id), original);
  for (const order of ["asc", "desc"] as const) { const list = sortProducts(products, order); for (let i=1; i<list.length; i++) assert.ok(order === "asc" ? list[i-1].today <= list[i].today : list[i-1].today >= list[i].today); }
  assert.deepEqual(products.map(p => p.id), original);
});
test("top six movers exclude flat products and rank largest percentage changes first", () => {
  for (const direction of ["up", "down"] as const) {
    const selected = movers(products, direction); assert.equal(selected.length, 6);
    assert.ok(selected.every(p => p.change.dir === direction));
    for (let i=1;i<selected.length;i++) assert.ok(Math.abs(selected[i-1].change.pct) >= Math.abs(selected[i].change.pct));
    assert.ok(products.filter(p => p.change.dir === direction && !selected.includes(p)).every(p => Math.abs(p.change.pct) <= Math.abs(selected[5].change.pct)));
  }
});
test("market summary uses range extremes and the average of market midpoints", () => {
  const stats = marketStats([{market:"A",division:"Dhaka",min:10,max:30},{market:"B",division:"Khulna",min:40,max:80}]);
  assert.ok(stats); assert.equal(stats.min,10); assert.equal(stats.max,80); assert.equal(stats.average,40); assert.equal(stats.cheapest.market,"A");
  assert.equal(marketStats([]),null);
  const rice = marketStats(products[0].markets); assert.equal(rice?.min,132); assert.equal(rice?.max,165);
});
test("prices, units and Dhaka dates display Bengali digits", () => {
  assert.equal(bn(1850), "১,৮৫০"); assert.equal(bn(2.1,1),"২.১"); assert.equal(unitLabel("dozen"),"ডজন");
  const date = banglaDate(new Date("2026-10-08T20:00:00Z")); assert.ok(date.includes("৯")); assert.ok(date.includes("২০২৬"));
});
