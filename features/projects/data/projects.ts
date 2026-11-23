// features/projects/data/projects.ts
// TODO: add real links (`url`, `sourceUrl`), CodeBridge's description and the
// category / overview / stack / status texts. Every project has its own page
// (/[locale]/projects/[slug]); a missing text shows the [To be added] placeholder
// and a missing link simply hides its button.

type Locale = "en" | "fa" | "ar";

export interface Project {
  slug: string;
  name: string;
  description: Record<Locale, string>;
  /** Live project (button on the project page). */
  url?: string;
  /** Source repository (button on the project page). */
  sourceUrl?: string;
  category?: Record<Locale, string>;
  overview?: Record<Locale, string>;
  stack?: Record<Locale, string>;
  status?: Record<Locale, string>;
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
