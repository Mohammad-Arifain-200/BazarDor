import { getLocaleTools } from "@/lib/locale-server";
import { AuthForm } from "@/components/auth-form";
import { authConfigured, socialProviders } from "@/lib/auth";
export async function generateMetadata() { const { t } = await getLocaleTools(); return { title: t("সাইন ইন") }; }
export default async function SignIn({ searchParams }: { searchParams: Promise<{ reason?: string; error?: string }> }) {
  const query = await searchParams;
  return <div className="auth-page"><AuthForm mode="signin" providers={socialProviders()} configured={authConfigured()} reason={query.reason} oauthError={query.error} /></div>;
}
