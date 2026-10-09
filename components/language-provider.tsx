"use client";
import { createContext, useContext, useMemo } from "react";
import { localeTools, type Locale } from "@/lib/i18n";
const LanguageContext = createContext<Locale>("bn");
export function LanguageProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LanguageContext.Provider value={locale}>{children}</LanguageContext.Provider>;
}
export function useLocale() { const locale = useContext(LanguageContext); return useMemo(() => localeTools(locale), [locale]); }
export function LanguageSwitch() {
  const { locale } = useLocale();
  function select(next: Locale) {
    if (next === locale) return;
    document.cookie = `bazardor_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    window.location.reload();
  }
  return <div className="language-switch" role="group" aria-label="Language / ভাষা">
    <button type="button" lang="bn" aria-pressed={locale === "bn"} onClick={() => select("bn")}>বাংলা</button>
    <button type="button" lang="en" aria-pressed={locale === "en"} onClick={() => select("en")}>English</button>
  </div>;
}
