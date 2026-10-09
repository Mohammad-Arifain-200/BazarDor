import { getCatalog } from "@/lib/catalog";
import { Ticker } from "./ticker";
export async function CatalogTicker() {
  const { products } = await getCatalog();
  return <Ticker products={products} />;
}
