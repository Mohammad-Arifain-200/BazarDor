import { getLocaleTools } from "@/lib/locale-server";
import { AuthForm } from "@/components/auth-form";
import { authConfigured, socialProviders } from "@/lib/auth";
export async function generateMetadata() { const { t } = await getLocaleTools(); return { title: t("সাইন আপ") }; }
export default function SignUp() { return <div className="auth-page"><AuthForm mode="signup" providers={socialProviders()} configured={authConfigured()} /></div>; }
