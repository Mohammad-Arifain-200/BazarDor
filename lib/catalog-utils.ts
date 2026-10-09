import { numericPrice } from "./format.ts";
import type { Product, Market } from "./types.ts";
export type SortOrder = "default" | "asc" | "desc";
export function sortProducts(products: Product[], order: SortOrder): Product[] {
  const copy = [...products];
  if (order !== "default") copy.sort((a, b) => (numericPrice(a.today) - numericPrice(b.today)) * (order === "asc" ? 1 : -1));
  return copy;
}
export function movers(products: Product[], direction: "up" | "down"): Product[] {
  return products.filter(p => p.change.dir === direction).sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct)).slice(0, 6);
}
export function marketStats(markets: Market[]) {
  if (!markets.length) return null;
  return { min: Math.min(...markets.map(m => m.min)), max: Math.max(...markets.map(m => m.max)),
    average: markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) / markets.length,
    cheapest: markets.reduce((a, b) => a.min <= b.min ? a : b) };
}
