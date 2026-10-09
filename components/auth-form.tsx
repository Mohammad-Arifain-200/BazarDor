"use client";
import { useLocale } from "@/components/language-provider";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CodeXml } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { UiButton } from "./ui-button";
export function AuthForm({ mode, providers, configured, reason, oauthError }: { mode: "signin" | "signup"; providers: { google: boolean; github: boolean }; configured: boolean; reason?: string; oauthError?: string }) {
  const { t } = useLocale();

  const signup = mode === "signup", router = useRouter();
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const notified = useRef(false);
  useEffect(() => {
    if (notified.current) return;
    notified.current = true;
    if (reason === "protected") toast.error(t("বিস্তারিত দেখতে আগে সাইন ইন করুন।"));
    if (oauthError) toast.error(t("সোশ্যাল সাইন ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।"));
  }, [reason, oauthError, t]);
  function fail(message: string) { setError(message); toast.error(message); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim(), email = String(form.get("email") || "").trim(), password = String(form.get("password") || "");
    if (signup && (name.length < 2 || name.length > 100)) return fail(t("নাম ২ থেকে ১০০ অক্ষরের মধ্যে লিখুন।"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return fail(t("একটি সঠিক ইমেইল ঠিকানা লিখুন।"));
    if (password.length < 8 || password.length > 128) return fail(t("পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের মধ্যে হতে হবে।"));
    if (!configured) return fail(t("অ্যাকাউন্ট সেবা এখন চালু নেই। কিছুক্ষণ পরে আবার চেষ্টা করুন।"));
    setBusy(true);
    try {
      const result = signup ? await authClient.signUp.email({ name, email, password }) : await authClient.signIn.email({ email, password });
      if (result.error) {
        const code = result.error.code;
        fail(code === "INVALID_EMAIL_OR_PASSWORD" ? t("ইমেইল বা পাসওয়ার্ড সঠিক নয়।") : code === "USER_ALREADY_EXISTS" ? t("এই ইমেইলের অ্যাকাউন্ট আছে। সাইন ইন করুন।") : t("অ্যাকাউন্ট সেবায় সমস্যা হয়েছে। আবার চেষ্টা করুন।"));
        return;
      }
      if (signup) { toast.success(t("নিবন্ধন সম্পন্ন। এখন সাইন ইন করুন।")); router.push("/signin"); }
      else { toast.success(t("সফলভাবে সাইন ইন হয়েছে")); router.push("/"); router.refresh(); }
    } catch { fail(t("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।")); }
    finally { setBusy(false); }
  }
  async function social(provider: "google" | "github") {
    setError("");
    if (!configured || !providers[provider]) return fail(`${provider === "google" ? "Google" : "GitHub"} ${t("দিয়ে সাইন ইন এখন চালু নেই। ইমেইল দিয়ে চেষ্টা করুন।")}`);
    setBusy(true);
    try {
      const { error } = await authClient.signIn.social({ provider, callbackURL: "/?auth=success", errorCallbackURL: "/signin?error=oauth" });
      if (error) fail(t("সোশ্যাল সাইন ইন করা যায়নি।"));
    } catch { fail(t("সোশ্যাল সাইন ইন করা যায়নি। সংযোগ পরীক্ষা করুন।")); }
    finally { setBusy(false); }
  }
  return <div className="auth-card"><h1>{signup ? t("অ্যাকাউন্ট তৈরি করুন") : t("সাইন ইন করুন")}</h1><p className="subtitle">{signup ? t("বাজারের বিস্তারিত দাম জানতে আপনার অ্যাকাউন্ট তৈরি করুন।") : t("আপনার অ্যাকাউন্টে ফিরে আসুন।")}</p>
    {!configured && <p className="source-notice mt-4">{t("অ্যাকাউন্ট সেবা সাময়িকভাবে বন্ধ আছে। পরে আবার চেষ্টা করুন।")}</p>}
    <form className="form" onSubmit={submit} noValidate aria-busy={busy}>
      {signup && <label htmlFor="name">{t("নাম")}<input id="name" name="name" autoComplete="name" placeholder={t("আপনার নাম")} required maxLength={100} /></label>}
      <label htmlFor="email">{t("ইমেইল")}<input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
      <label htmlFor="password">{t("পাসওয়ার্ড")}<input id="password" name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} placeholder={t("কমপক্ষে ৮ অক্ষর")} required minLength={8} maxLength={128} /><span className="form-hint">{t("কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড ব্যবহার করুন।")}</span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <UiButton type="submit" disabled={busy} className="btn-primary btn-wide">{busy ? t("অপেক্ষা করুন…") : signup ? t("সাইন আপ") : t("সাইন ইন")}</UiButton>
    </form>
    <div className="auth-divider">{t("অথবা")}</div><div className="social-buttons"><UiButton className="btn-outline btn-wide" disabled={busy} onClick={() => social("google")}><span aria-hidden className="font-bold text-blue-600">G</span> {t(" Google দিয়ে চালিয়ে যান")}</UiButton><UiButton className="btn-outline btn-wide" disabled={busy} onClick={() => social("github")}><CodeXml size={17} aria-hidden /> {t(" GitHub দিয়ে চালিয়ে যান")}</UiButton></div>
    <p className="auth-switch">{signup ? t("আগেই অ্যাকাউন্ট আছে? ") : t("অ্যাকাউন্ট নেই? ")}<Link className="text-link" href={signup ? "/signin" : "/signup"}>{signup ? t("সাইন ইন করুন") : t("সাইন আপ করুন")}</Link></p><Link href="/" className="auth-back">{t("← হোম পেজে ফিরে যান")}</Link>
  </div>;
}
