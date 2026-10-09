"use client";
import { useLocale } from "@/components/language-provider";
import type { Product } from "@/lib/types";
export function ChangeBadge({ change }: { change: Product["change"] }) {
  const { t, bn } = useLocale();

  return <span className={`change-badge ${change.dir}`} aria-label={`${change.dir === "up" ? t("বেড়েছে") : change.dir === "down" ? t("কমেছে") : t("অপরিবর্তিত")} ${bn(Math.abs(change.pct), 1)} ${t("শতাংশ")}`}>
    {change.dir === "up" ? "▲" : change.dir === "down" ? "▼" : "—"} {bn(Math.abs(change.pct), 1)}%
  </span>;
}
