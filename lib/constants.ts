export const SUBJECTS = [
  "زیست‌شناسی",
  "شیمی",
  "فیزیک",
  "ریاضی",
  "زمین شناسی",
] as const;

export const DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
] as const;

export const SUBJECT_ICONS = [
  "🧬",
  "⚗️",
  "⚛️",
  "📐",
  "📚",
  "🕌",
  "☪️",
  "🌐",
] as const;

export const SUBJECT_ACCENTS = [
  "#6E9878",
  "#C9A15D",
  "#E8B979",
  "#8BAF9E",
  "#A78B6F",
  "#7A9A87",
  "#B89968",
  "#9DBFA8",
] as const;

export const POMODORO_PRESETS = [
  { label: "۲۵ دقیقه", value: 25 },
  { label: "۴۵ دقیقه", value: 45 },
  { label: "۵۰ دقیقه", value: 50 },
  { label: "۹۰ دقیقه", value: 90 },
] as const;

export const GROWTH_STAGES = [
  { key: "seed", label: "بذر", emoji: "🌱", minXP: 0 },
  { key: "sprout", label: "جوانه", emoji: "🌿", minXP: 200 },
  { key: "sapling", label: "نهال", emoji: "☘️", minXP: 600 },
  { key: "tree", label: "درخت", emoji: "🌲", minXP: 1500 },
  { key: "oak", label: "بلوط", emoji: "🌳", minXP: 3000 },
] as const;

export function toPersianDigits(input: string | number): string {
  const map = "۰۱۲۳۴۵۶۷۸۹";
  return String(input).replace(/[0-9]/g, (d) => map[Number(d)]);
}

export function formatHours(h: number): string {
  return toPersianDigits(h.toFixed(1));
}
