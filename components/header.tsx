"use client";
import { LanguageSwitch, useLocale } from "@/components/language-provider";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import categories from "@/data/categories.json";
import { UiButton } from "./ui-button";
export function Header({ date }: { date: string }) {
  const { t } = useLocale();

  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  async function logout() {
    try {
      const { error } = await authClient.signOut();
      if (error) { toast.error(t("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।")); return; }
      toast.success(t("সাইন আউট হয়েছে")); router.replace("/"); router.refresh();
    } catch { toast.error(t("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।")); }
  }
  return <header className="site-header">
    <div className="container header-row">
      <Link href="/" className="brand" aria-label={t("বাজার দর — হোম")}>
        <Image src="/logo-icon.png" width={32} height={32} alt="" priority />
        <span><strong>{t("বাজার দর")}</strong><small>{date}</small></span>
      </Link>
      <div className="auth-links"><LanguageSwitch />
        {isPending ? <div className="skeleton auth-skeleton" aria-label={t("অ্যাকাউন্ট লোড হচ্ছে")} /> : session ?
          <details className="user-menu"><summary><span className="avatar">{session.user.name?.trim().slice(0, 1) || "👤"}</span><span className="user-name">{session.user.name}</span><span aria-hidden>▾</span></summary>
            <div className="menu-panel"><p>{session.user.email}</p><Link href="/profile">{t("আমার প্রোফাইল")}</Link><UiButton className="btn-ghost" onClick={logout}>{t("↩ সাইন আউট")}</UiButton></div>
          </details> : <><Link href="/signin" className="btn btn-outline">{t("সাইন ইন")}</Link><Link href="/signup" className="btn btn-primary">{t("সাইন আপ")}</Link></>}
      </div>
    </div>
    <nav className="category-nav" aria-label={t("পণ্যের বিভাগ")}><div className="container nav-track">
      {categories.map(c => <Link key={c.id} href={`/category/${c.slug}`} className={`nav-link ${pathname === `/category/${c.slug}` ? "active" : ""}`} aria-current={pathname === `/category/${c.slug}` ? "page" : undefined}><span>{c.icon}</span>{t(c.nameBn)}</Link>)}
    </div></nav>
  </header>;
}
