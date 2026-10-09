"use client";
import { useLocale } from "@/components/language-provider";
import Link from "next/link";
export default function NotFound() {
  const { t } = useLocale();

  return <div className="container empty-state"><p className="empty-icon">🧺</p><p className="eyebrow">{t("৪০৪ · পেজ পাওয়া যায়নি")}</p><h1>{t("এই পণ্য বা পেজটি খুঁজে পাওয়া যাচ্ছে না")}</h1><p>{t("লিংকটি ভুল হতে পারে। হোম পেজ থেকে পণ্যের দাম দেখুন।")}</p><Link href="/" className="btn btn-primary">{t("হোম পেজে ফিরে যান")}</Link></div>;
}
