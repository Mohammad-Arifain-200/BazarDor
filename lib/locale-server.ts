import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { localeTools, normalizeLocale } from "./i18n";
export const getLocaleTools = cache(async () => localeTools(normalizeLocale((await cookies()).get("bazardor_locale")?.value)));
