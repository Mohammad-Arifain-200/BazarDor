"use client";
import { useLocale } from "@/components/language-provider";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { sortProducts, type SortOrder } from "@/lib/catalog-utils";
import { ProductGrid } from "./product-grid";
import Link from "next/link";
export function ProductList({ products, search = false }: { products: Product[]; search?: boolean }) {
  const { t, bn } = useLocale();

  const [order, setOrder] = useState<SortOrder>("default");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => sortProducts(products.filter(p => [p.nameBn, t(p.nameBn)].some(name => name.toLowerCase().includes(query.trim().toLowerCase()))), order), [products, order, query, t]);
  return <>
    <div className="catalog-toolbar">
      {search && <label className="search-box"><span className="sr-only">{t("পণ্য খুঁজুন")}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t("পণ্যের নাম লিখুন…")} /></label>}
      <label className="sort-control"><span>{t("সাজান:")}</span><span className="select-wrap"><select value={order} onChange={event => setOrder(event.target.value as SortOrder)} aria-label={t("পণ্যের দাম অনুযায়ী সাজান")}><option value="default">{t("ডিফল্ট")}</option><option value="asc">{t("দাম: কম থেকে বেশি")}</option><option value="desc">{t("দাম: বেশি থেকে কম")}</option></select></span></label>
    </div>
    {visible.length ? <ProductGrid products={visible} /> : <div className="empty-state"><p className="empty-icon">🔎</p><h2>{t("কোনো পণ্য পাওয়া যায়নি")}</h2><p>{t("পণ্যের নাম পরিবর্তন করে আবার খুঁজুন।")}</p><Link href="/" className="btn btn-primary">{t("হোম পেজে ফিরে যান")}</Link></div>}
    <p className="results-count" aria-live="polite">{t("মোট ")}{bn(visible.length)}{t("টি পণ্য দেখানো হচ্ছে")}</p>
  </>;
}
