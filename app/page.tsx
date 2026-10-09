import { getLocaleTools } from "@/lib/locale-server";
import Image from "next/image";
import { AuthStatusToast } from "@/components/auth-status-toast";
import { getCatalog } from "@/lib/catalog";
import { movers } from "@/lib/catalog-utils";
import { ProductGrid } from "@/components/product-grid";
import { ProductList } from "@/components/product-list";
import { SourceNotice } from "@/components/source-notice";
export default async function HomePage({ searchParams }: { searchParams: Promise<{ auth?: string }> }) {
  const { t, bn, banglaDate } = await getLocaleTools();

  const query = await searchParams;
  const { products, categories, source } = await getCatalog();
  return <div className="container page-content">
    {query.auth === "success" && <AuthStatusToast />}
    <section className="hero" aria-labelledby="hero-title"><div><p className="eyebrow">{banglaDate()}</p><h1 id="hero-title">{t("আজকের বাজারের দাম এক নজরে")}</h1><p className="hero-description">{t("চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।")}</p><a href="#সব-পণ্য" className="btn btn-primary">{t("সব পণ্যের দাম দেখুন ")}<span aria-hidden>↓</span></a><div className="hero-stats"><span><strong>{bn(products.length)}</strong>{t("টি নিত্যদিনের পণ্য")}</span><span><strong>{bn(categories.length)}</strong>{t("টি বিভাগ")}</span></div></div><div className="hero-image"><Image src="/bazar-hero.png" alt={t("তাজা ফল ও নিত্যপণ্যের বাজারের ঝুড়ি")} width={315} height={263} priority /></div></section>
    <SourceNotice source={source} />
    <section className="section" aria-labelledby="risers"><div className="section-heading"><h2 id="risers">{t("আজ দাম বেড়েছে ")}<span className="up-symbol">▲</span></h2><p>{t("দামের পরিবর্তনে শীর্ষ ৬")}</p></div><ProductGrid products={movers(products, "up")} /></section>
    <section className="section" aria-labelledby="fallers"><div className="section-heading"><h2 id="fallers">{t("আজ দাম কমেছে ")}<span className="down-symbol">▼</span></h2><p>{t("দামের পরিবর্তনে শীর্ষ ৬")}</p></div><ProductGrid products={movers(products, "down")} /></section>
    <section className="section" id="সব-পণ্য" aria-labelledby="all-products"><div className="section-heading"><div><h2 id="all-products">{t("সব পণ্য")}</h2><p>{t("নিত্যপ্রয়োজনীয় সব পণ্যের আজকের দাম ও পরিবর্তন")}</p></div></div><ProductList products={products} search /></section>
  </div>;
}
