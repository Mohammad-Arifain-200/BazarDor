const bengaliDigits = "০১২৩৪৫৬৭৮৯";
export function numericPrice(value: number | string): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(value.replace(/[০-৯]/g, digit => String(bengaliDigits.indexOf(digit))).replace(/[,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
export function bn(value: number | string, decimals = 0): string {
  return new Intl.NumberFormat("bn-BD", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(numericPrice(value));
}
export function banglaDate(date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", { timeZone: "Asia/Dhaka", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}
export function unitLabel(unit: string): string {
  return ({ kg: "কেজি", litre: "লিটার", liter: "লিটার", dozen: "ডজন", piece: "পিস" } as Record<string,string>)[unit] ?? unit;
}
