import type { Category, Market, Product } from "./types.ts";

type RecordValue = Record<string, unknown>;

function record(value: unknown, label: string): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid ${label}`);
  }
  return value as RecordValue;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`Missing ${label}`);
  return value.trim();
}

function number(value: unknown, label: string, allowNegative = false): number {
  if (typeof value !== "number" && typeof value !== "string") throw new Error(`Invalid ${label}`);
  const normalized = String(value).trim().replace(/[০-৯]/g, digit => String("০১২৩৪৫৬৭৮৯".indexOf(digit))).replace(/,/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) throw new Error(`Invalid ${label}`);
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || (!allowNegative && parsed < 0)) throw new Error(`Invalid ${label}`);
  return parsed;
}

function market(value: unknown): Market {
  const m = record(value, "market");
  const min = number(m.min, "minimum price"), max = number(m.max, "maximum price");
  if (min > max) throw new Error("Market minimum exceeds maximum");
  return { market: text(m.market, "market name"), division: text(m.division, "division"), min, max };
}

export function normalizeProducts(value: unknown): Product[] {
  if (!Array.isArray(value) || !value.length) throw new Error("Empty catalog");
  const products = value.map(item => {
    const p = record(item, "product"), change = record(p.change, "price change");
    const dir = change.dir;
    if (dir !== "up" && dir !== "down" && dir !== "flat") throw new Error("Invalid change direction");
    if (!Array.isArray(p.markets)) throw new Error("Missing market list");
    const id = number(p.id, "product ID");
    if (!Number.isSafeInteger(id) || id < 1) throw new Error("Invalid product ID");
    return {
      id, slug: text(p.slug, "product slug"), nameBn: text(p.nameBn, "product name"),
      category: text(p.category, "category ID"), categoryNameBn: text(p.categoryNameBn, "category name"),
      categoryIcon: text(p.categoryIcon, "category icon"), unit: text(p.unit, "unit"), image: text(p.image, "product illustration"),
      today: number(p.today, "today's price"), yesterday: number(p.yesterday, "yesterday's price"),
      lastWeek: number(p.lastWeek, "last week's price"), lastMonth: number(p.lastMonth, "last month's price"),
      change: { dir, pct: number(change.pct, "change percentage", true) }, markets: p.markets.map(market),
    } satisfies Product;
  });
  if (new Set(products.map(p => p.id)).size !== products.length || new Set(products.map(p => p.slug)).size !== products.length) {
    throw new Error("Duplicate product ID or slug");
  }
  return products;
}

export function normalizeCategories(value: unknown): Category[] {
  if (!Array.isArray(value) || !value.length) throw new Error("Empty category list");
  const categories = value.map(item => {
    const c = record(item, "category");
    return { id: text(c.id, "category ID"), slug: text(c.slug, "category slug"), nameBn: text(c.nameBn, "category name"), icon: text(c.icon, "category icon") };
  });
  if (new Set(categories.map(c => c.id)).size !== categories.length || new Set(categories.map(c => c.slug)).size !== categories.length) {
    throw new Error("Duplicate category ID or slug");
  }
  return categories;
}
