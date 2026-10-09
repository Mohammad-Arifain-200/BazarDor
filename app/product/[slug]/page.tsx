import { getLocaleTools } from "@/lib/locale-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog";
import { requireSession } from "@/lib/session";
import { marketStats } from "@/lib/catalog-utils";
import { ChangeBadge } from "@/components/change-badge";
import { SourceNotice } from "@/components/source-notice";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t, bn, unitLabel } = await getLocaleTools();

  const { slug } = await params;
  const { products, source } = await getCatalog();
  const product = products.find(p => p.slug === slug || String(p.id) === slug);
  if (!product) notFound();
  await requireSession();
  const p = product, stats = marketStats(p.markets), difference = p.today - p.yesterday;
  return <div className="container page-content">
    <nav className="breadcrumb" aria-label={t("পেজের অবস্থান")}><Link href="/">{t("হোম")}</Link><span>/</span><Link href={`/category/${p.category}`}>{t(p.categoryNameBn)}</Link><span>/</span><span>{t(p.nameBn)}</span></nav>
    <SourceNotice source={source} />
    <section className="detail-summary"><div className="detail-emoji" aria-hidden>{p.image}</div><div><h1>{t(p.nameBn)}</h1><p>{t("গতকালের তুলনায় আজ দাম ")}{difference > 0 ? t("বেড়েছে") : difference < 0 ? t("কমেছে") : t("অপরিবর্তিত")}{difference !== 0 ? ` · ${bn(Math.abs(difference))} ${t("টাকা")}` : ""}</p><div className="detail-tags"><Link className="tag" href={`/category/${p.category}`}>{p.categoryIcon} {t(p.categoryNameBn)}</Link><span className="tag">{t("প্রতি ")}{unitLabel(p.unit)}</span><ChangeBadge change={p.change} /></div></div></section>
    {stats && <><div className="stats-grid"><article className="stat-card"><h2>{t("সর্বনিম্ন দাম")}</h2><p className="stat-value">{bn(stats.min)} <span>{t("টাকা")}</span></p><p>{t("সব বাজারের সর্বনিম্ন মূল্য")}</p></article><article className="stat-card"><h2>{t("সর্বাধিক দাম")}</h2><p className="stat-value">{bn(stats.max)} <span>{t("টাকা")}</span></p><p>{t("সব বাজারের সর্বাধিক মূল্য")}</p></article><article className="stat-card"><h2>{t("গড় দাম")}</h2><p className="stat-value">{bn(stats.average, 2)} <span>{t("টাকা")}</span></p><p>{t("বাজারগুলোর মধ্যমূল্যের গড়")}</p></article></div>
    <section className="section"><div className="section-heading"><h2>{t("বাজারভিত্তিক আজকের দাম")}</h2><p>{bn(p.markets.length)}{t("টি বাজার")}</p></div><div className="table-wrap"><table><caption>{t(p.nameBn)} {t(" — টাকা / ")}{unitLabel(p.unit)}</caption><thead><tr><th scope="col">{t("বাজার")}</th><th scope="col">{t("বিভাগ")}</th><th scope="col">{t("সর্বনিম্ন")}</th><th scope="col">{t("সর্বাধিক")}</th><th scope="col">{t("গড়")}</th></tr></thead><tbody>{p.markets.map(m => <tr key={`${t(m.division)}-${t(m.market)}`}><td>{t(m.market)}</td><td>{t(m.division)}</td><td>{bn(m.min)} {t(" টাকা")}</td><td>{bn(m.max)} {t(" টাকা")}</td><td>{bn((m.min + m.max) / 2, 2)} {t(" টাকা")}</td></tr>)}</tbody></table></div><p className="cheapest-note">{t("সবচেয়ে কম দামের বাজার: ")}<strong>{t(stats.cheapest.market)}</strong> ({t(stats.cheapest.division)}) — {bn(stats.min)} {t(" টাকা / ")}{unitLabel(p.unit)}</p></section></>}
    {!stats && <p className="source-notice">{t("এই পণ্যের বাজারভিত্তিক তথ্য এখনও পাওয়া যায়নি।")}</p>}
    <section className="section"><h2 className="text-xl">{t("দামের তুলনা")}</h2><div className="history-grid">{[{ label: t("আজ"), value: p.today }, { label: t("গতকাল"), value: p.yesterday }, { label: t("গত সপ্তাহ"), value: p.lastWeek }, { label: t("গত মাস"), value: p.lastMonth }].map(item => <div className="history-item" key={item.label}><p>{item.label}</p><strong>{bn(item.value)} {t(" টাকা")}</strong></div>)}</div></section>
  </div>;
}
