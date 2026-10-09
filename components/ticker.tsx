"use client";
import { useLocale } from "@/components/language-provider";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { ChangeBadge } from "./change-badge";
export function Ticker({ products }: { products: Product[] }) {
  const { t, bn, unitLabel } = useLocale();

  const [paused, setPaused] = useState(false);
  return <div className={`ticker ${paused ? "paused" : ""}`}>
    <div className="ticker-window" aria-label={t("পণ্যের দামের তালিকা")}><div className="ticker-track">
      {[false, true].map(duplicate => <div key={String(duplicate)} className="ticker-list" aria-hidden={duplicate || undefined}>
        {products.map(p => <span className="ticker-item" key={p.id}><span>{p.image}</span><span>{t(p.nameBn)}</span><span>{bn(p.today)} {t(" টাকা/")}{unitLabel(p.unit)}</span><ChangeBadge change={p.change} /></span>)}
      </div>)}
    </div></div>
    <button className="ticker-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? t("দামের তালিকা চালু করুন") : t("দামের তালিকা থামান")} aria-pressed={paused}>{paused ? "▶" : "Ⅱ"}</button>
  </div>;
}
