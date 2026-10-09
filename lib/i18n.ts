import { english } from "./translations.ts";
import { numericPrice, unitLabel as bengaliUnit } from "./format.ts";
export type Locale = "bn" | "en";
export function normalizeLocale(value?: string): Locale { return value === "en" ? "en" : "bn"; }
export function localeTools(locale: Locale) {
  const t = (value: string): string => locale === "bn" ? value : value.replace(/\S(?:[\s\S]*\S)?/, key => english[key] ?? key);
  const bn = (value: string | number, decimals = 0) => new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(numericPrice(value));
  const banglaDate = (date = new Date()) => new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-BD", { timeZone: "Asia/Dhaka", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
  const unitLabel = (unit: string) => t(bengaliUnit(unit));
  return { locale, t, bn, banglaDate, unitLabel };
}
