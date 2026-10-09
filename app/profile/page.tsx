import { getLocaleTools } from "@/lib/locale-server";
import Link from "next/link";
import { requireSession } from "@/lib/session";
export async function generateMetadata() { const { t } = await getLocaleTools(); return { title: t("আমার প্রোফাইল") }; }
export default async function Profile() {
  const { t, banglaDate } = await getLocaleTools();

  const { user } = await requireSession();
  return <div className="container page-content"><div className="profile-card"><div className="avatar profile-avatar">{user.name.trim().slice(0,1)}</div><h1>{t("আমার প্রোফাইল")}</h1><p className="subtitle">{t("আপনার অ্যাকাউন্টের তথ্য")}</p><dl><div><dt>{t("নাম")}</dt><dd>{user.name}</dd></div><div><dt>{t("ইমেইল")}</dt><dd>{user.email}</dd></div><div><dt>{t("অ্যাকাউন্ট তৈরি")}</dt><dd>{banglaDate(new Date(user.createdAt))}</dd></div></dl><Link href="/profile/update" className="btn btn-primary">{t("তথ্য আপডেট করুন")}</Link><Link href="/" className="auth-back">{t("← হোম পেজে ফিরে যান")}</Link></div></div>;
}
