"use client";
import { useLocale } from "@/components/language-provider";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export function AuthStatusToast() {
  const { t } = useLocale();

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const notified = useRef(false);
  useEffect(() => {
    if (isPending || notified.current) return;
    notified.current = true;
    if (session) toast.success(t("সফলভাবে সাইন ইন হয়েছে"));
    router.replace("/", { scroll: false });
  }, [session, isPending, router, t]);
  return null;
}
