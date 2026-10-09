import { getLocaleTools } from "@/lib/locale-server";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog";
import { ProductList } from "@/components/product-list";
import { SourceNotice } from "@/components/source-notice";
import Link from "next/link";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t, bn } = await getLocaleTools();

  const { slug } = await params;
  const { products, categories, source } = await getCatalog();
  const category = categories.find(c => c.slug === slug);
  if (!category) notFound();
  const list = products.filter(p => p.category === category.id);
  if (!list.length) return <div className="container empty-state"><p className="empty-icon">{category.icon}</p><h1>{t("এই বিভাগে কোনো পণ্য নেই")}</h1><p>{t("পণ্যের তথ্য পাওয়া গেলে এখানে দেখানো হবে।")}</p><Link href="/" className="btn btn-primary">{t("হোম পেজে ফিরে যান")}</Link></div>;
  return <div className="container page-content"><div className="breadcrumb"><Link href="/">{t("হোম")}</Link><span>/</span><span>{t(category.nameBn)}</span></div><div className="section-heading"><div><h1 className="text-2xl">{category.icon} {t(category.nameBn)}</h1><p>{bn(list.length)}{t("টি পণ্যের আজকের দাম ও পরিবর্তন")}</p></div></div><SourceNotice source={source} /><ProductList products={list} /></div>;
}
