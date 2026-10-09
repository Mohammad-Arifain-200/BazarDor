"use client";
import { useLocale } from "@/components/language-provider";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { ChangeBadge } from "./change-badge";
export function ProductCard({ product: p }: { product: Product }) {
  const { t, bn, unitLabel } = useLocale();

  return <Link href={`/product/${p.slug}`} className="product-card" aria-label={`${t(p.nameBn)}, ${bn(p.today)} ${t("টাকা")} ${t("প্রতি")} ${unitLabel(p.unit)} — ${t("বিস্তারিত দেখুন")}`}>
    <div className="product-top"><span className="product-emoji" aria-hidden>{p.image}</span><div><h3>{t(p.nameBn)}</h3><p>{t("প্রতি ")}{unitLabel(p.unit)}</p></div></div>
    <div className="price-row"><div><span className="price-label">{t("আজকের দাম")}</span><p className="price"><strong>{bn(p.today)}</strong> <span>{t("টাকা")}</span></p></div><ChangeBadge change={p.change} /></div>
  </Link>;
}
