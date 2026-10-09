import "server-only";
import { cache } from "react";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import type { Catalog, Product } from "./types";
import { normalizeProducts, normalizeCategories } from "./catalog-schema";
async function request(base: string, path: string) {
  const response = await fetch(base.replace(/\/$/, "") + path, { next: { revalidate: 300 }, signal: AbortSignal.timeout(3500) });
  if (!response.ok) throw new Error(`Catalog API returned ${response.status}`);
  return response.json();
}
export const getCatalog = cache(async (): Promise<Catalog> => {
  if (process.env.BAZARDOR_SNAPSHOT_ONLY !== "true") {
    const bases = [process.env.BAZARDOR_API_URL || "https://api.api-store.workers.dev/api/bazardor", process.env.BAZARDOR_API_FALLBACK_URL || "https://api.abcz.workers.dev/api/bazardor"];
    for (const base of bases) {
      try {
        const [rawProducts, rawCategories] = await Promise.all([request(base, "/products"), request(base, "/categories")]);
        const normalizedProducts = normalizeProducts(rawProducts), normalizedCategories = normalizeCategories(rawCategories);
        const ids = new Set(normalizedCategories.map(c => c.id));
        if (normalizedProducts.some(p => !ids.has(p.category))) throw new Error("Unknown product category");
        return { products: normalizedProducts, categories: normalizedCategories, source: "api" };
      } catch { /* Try the alternative, then the explicitly labeled supplied snapshot. */ }
    }
  }
  return { products: products as Product[], categories, source: "snapshot" };
});
