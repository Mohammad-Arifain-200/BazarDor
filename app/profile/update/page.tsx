import { getLocaleTools } from "@/lib/locale-server";
import { requireSession } from "@/lib/session";
import { UpdateProfileForm } from "@/components/update-profile-form";
export async function generateMetadata() { const { t } = await getLocaleTools(); return { title: t("তথ্য আপডেট") }; }
export default async function UpdateProfile() { const { user } = await requireSession(); return <div className="container page-content"><UpdateProfileForm currentName={user.name} /></div>; }
