"use client";
import { useLocale } from "@/components/language-provider";
export function SourceNotice({ source }: { source: "api" | "snapshot" }) {
  const { t } = useLocale();

  return source === "snapshot" ? <p className="source-notice" role="status">{t("ⓘ API থেকে বর্তমান তথ্য পাওয়া যায়নি বা snapshot mode চালু আছে। এখানে assignment-এর দেওয়া সংরক্ষিত ডেটা দেখানো হচ্ছে।")}</p> : <p className="data-note">{t("তথ্যসূত্র: BazarDor API · দাম প্রতি ৫ মিনিটে পুনরায় যাচাই করা হয়।")}</p>;
}
