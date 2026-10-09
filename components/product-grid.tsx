import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
export function ProductGrid({ products }: { products: Product[] }) {
  return <div className="product-grid">{products.map(p => <ProductCard product={p} key={p.id} />)}</div>;
}
