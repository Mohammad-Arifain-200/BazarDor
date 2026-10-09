"use client";
import { useLocale } from "@/components/language-provider";
export function CatalogSkeleton() {
  const { t } = useLocale();

  return <div className="container page-content" role="status" aria-label={t("পণ্যের দাম লোড হচ্ছে")}><span className="sr-only">{t("লোড হচ্ছে…")}</span>
    <div className="skeleton skeleton-heading" /><div className="skeleton skeleton-subtitle" />
    <div className="product-grid">{Array.from({ length: 9 }, (_, i) => <div className="product-card skeleton-card" key={i}><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line short" /></div>)}</div>
  </div>;
}
