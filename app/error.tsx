"use client";
import { useLocale } from "@/components/language-provider";
import Link from "next/link";
import { UiButton } from "@/components/ui-button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLocale();

  return <div className="container empty-state"><p className="empty-icon">⚠️</p><h1>{t("এই মুহূর্তে পেজটি লোড হচ্ছে না")}</h1><p>{t("সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।")}</p><div className="flex flex-wrap justify-center gap-3"><UiButton className="btn-primary" onClick={reset}>{t("আবার চেষ্টা করুন")}</UiButton><Link className="btn btn-outline" href="/">{t("হোম পেজে ফিরে যান")}</Link></div></div>;
}
