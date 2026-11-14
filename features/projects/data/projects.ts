// features/projects/data/projects.ts
// TODO: add real links (`url`) and finish CodeBridge's description.
// A project without `url` renders as a plain card with no link.

type Locale = "en" | "fa" | "ar";

export interface Project {
  slug: string;
  name: string;
  description: Record<Locale, string>;
  url?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "tarvix-market",
    name: "Tarvix Market",
    description: {
      en: "Multi-branch grocery marketplace prototype",
      fa: "نمونه‌ی اولیه‌ی بازارچه‌ی چندشعبه‌ای خواروبار",
      ar: "نموذج أولي لسوق بقالة متعدد الفروع",
    },
  },
  {
    slug: "crypto-market-radar",
    name: "Crypto Market Radar",
    description: {
      en: "Customer-feedback signals for digital-asset teams",
      fa: "سیگنال‌های بازخورد مشتری برای تیم‌های دارایی دیجیتال",
      ar: "إشارات ملاحظات العملاء لفرق الأصول الرقمية",
    },
  },
  {
    slug: "codebridge",
    name: "CodeBridge",
    description: {
      en: "[One-line description]",
      fa: "[توضیح یک‌خطی]",
      ar: "[وصف في سطر واحد]",
    },
  },
];
