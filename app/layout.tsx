import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { CatalogTicker } from "@/components/catalog-ticker";
import { getLocaleTools } from "@/lib/locale-server";
import { LanguageProvider } from "@/components/language-provider";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";
import "./globals.css";
export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getLocaleTools();
  return { title: { default: t("বাজার দর — আজকের বাজারের দাম"), template: locale === "en" ? "%s | BazarDor" : "%s | বাজার দর" }, description: t("চাল, ডাল, তেল, সবজি, মাছ ও নিত্যপণ্যের বাজারভিত্তিক দাম এক নজরে।"), icons: { icon: "/logo-icon.png" } };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const { t, locale, banglaDate } = await getLocaleTools();
  return <html lang={locale}><body><LanguageProvider locale={locale}><a href="#main-content" className="skip-link">{t("মূল অংশে যান")}</a><Header date={banglaDate()} />
    <Suspense fallback={<div className="ticker skeleton" aria-label={t("দামের তালিকা লোড হচ্ছে")} />}><CatalogTicker /></Suspense>
    <main id="main-content">{children}</main><Footer /><Providers /></LanguageProvider></body></html>;
}
