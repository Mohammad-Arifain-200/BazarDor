"use client";
import { useLocale } from "@/components/language-provider";
export function Footer() {
  const { t } = useLocale();

  return <footer className="site-footer"><div className="container footer-row"><p><strong>{t("বাজার দর")}</strong> {t(" — প্রয়োজনীয় পণ্যের দাম এক নজরে।")}</p><p>{t("সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।")}</p></div></footer>;
}
