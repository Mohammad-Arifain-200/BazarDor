"use client";
import { useLocale } from "@/components/language-provider";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { UiButton } from "./ui-button";
export function UpdateProfileForm({ currentName }: { currentName: string }) {
  const { t } = useLocale();

  const [name, setName] = useState(currentName), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const router = useRouter();
  async function update(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const cleaned = name.trim();
    if (cleaned.length < 2 || cleaned.length > 100) { setError(t("নাম ২ থেকে ১০০ অক্ষরের মধ্যে লিখুন।")); toast.error(t("সঠিক নাম লিখুন।")); return; }
    setBusy(true);
    try {
      const result = await authClient.updateUser({ name: cleaned });
      if (result.error) { setError(t("তথ্য আপডেট করা যায়নি।")); toast.error(t("তথ্য আপডেট করা যায়নি।")); return; }
      await authClient.getSession({ query: { disableCookieCache: true } });
      toast.success(t("আপনার নাম আপডেট হয়েছে")); router.push("/profile"); router.refresh();
    } catch { setError(t("সার্ভারে সংযোগ করা যায়নি।")); toast.error(t("সার্ভারে সংযোগ করা যায়নি।")); }
    finally { setBusy(false); }
  }
  return <div className="profile-card"><h1>{t("তথ্য আপডেট করুন")}</h1><p className="subtitle">{t("আপনার প্রোফাইলের নাম পরিবর্তন করুন।")}</p><form className="form" onSubmit={update} noValidate aria-busy={busy}><label htmlFor="profile-name">{t("নাম")}<input id="profile-name" autoComplete="name" value={name} onChange={event => setName(event.target.value)} maxLength={100} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<UiButton type="submit" className="btn-primary" disabled={busy}>{busy ? t("আপডেট হচ্ছে…") : t("তথ্য আপডেট করুন")}</UiButton></form><Link href="/profile" className="auth-back">{t("← প্রোফাইলে ফিরে যান")}</Link></div>;
}
