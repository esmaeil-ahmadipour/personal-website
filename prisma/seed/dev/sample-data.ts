// prisma/seed/dev/sample-data.ts
//
// DEVELOPMENT-ONLY sample data used by prisma/seed-dev.ts. Never imported by the
// release seed registry. Texts marked "[Sample]" are placeholders for debugging.

import { renderMarkdown } from "../../content/render";

export const AUTHOR_SLUG = "esmaeil-ahmadipour";

interface Tri {
  en: string;
  fa: string;
  ar: string;
}

/**
 * Markdown with three headings so the article table of contents is shown.
 * Stored as sanitized HTML, exactly like imported content: the article page
 * renders the stored value as HTML, so raw Markdown would show literal "##".
 */
function body(excerpt: Tri) {
  const markdown = {
    en: `## Overview\n\n${excerpt.en}\n\n## Details\n\n[Sample] Body text for the development preview.\n\n## Summary\n\n[Sample] Closing notes.`,
    fa: `## مقدمه\n\n${excerpt.fa}\n\n## جزئیات\n\n[نمونه] متن آزمایشی برای پیش‌نمایش در حالت توسعه.\n\n## جمع‌بندی\n\n[نمونه] نکات پایانی.`,
    ar: `## نظرة عامة\n\n${excerpt.ar}\n\n## التفاصيل\n\n[عينة] نص تجريبي لمعاينة وضع التطوير.\n\n## الخلاصة\n\n[عينة] ملاحظات ختامية.`,
  };
  return {
    contentEn: renderMarkdown(markdown.en),
    contentFa: renderMarkdown(markdown.fa),
    contentAr: renderMarkdown(markdown.ar),
  };
}

/** Demo covers live in public/images/demo (SVGs taken from the design). */
const COVER = (name: string) => `/images/demo/cover-${name}.svg`;

interface DemoPost {
  slug: string;
  coverImageUrl: string | null;
  categorySlug: string;
  tagSlugs: string[];
  publishedAt: string;
  readingTimeMin: number;
  titleEn: string;
  titleFa: string;
  titleAr: string;
  excerptEn: string;
  excerptFa: string;
  excerptAr: string;
  contentEn: string;
  contentFa: string;
  contentAr: string;
}

function post(
  slug: string,
  categorySlug: string,
  tagSlugs: string[],
  publishedAt: string,
  readingTimeMin: number,
  title: Tri,
  excerpt: Tri,
  coverImageUrl: string | null = null,
): DemoPost {
  return {
    slug,
    coverImageUrl,
    categorySlug,
    tagSlugs,
    publishedAt,
    readingTimeMin,
    titleEn: title.en,
    titleFa: title.fa,
    titleAr: title.ar,
    excerptEn: excerpt.en,
    excerptFa: excerpt.fa,
    excerptAr: excerpt.ar,
    ...body(excerpt),
  };
}

// Two extra posts: together with the 3 imported from content/posts the blog shows 5.
export const DEMO_POSTS: DemoPost[] = [
  post(
    "demo-realtime-market-data-flutter",
    "flutter",
    ["flutter", "architecture"],
    "2026-10-05",
    6,
    {
      en: "[Sample] Real-time market data in Flutter",
      fa: "[نمونه] داده‌ی بازار لحظه‌ای در فلاتر",
      ar: "[عينة] بيانات السوق اللحظية في فلاتر",
    },
    {
      en: "How WebSocket streams reach the UI without jank.",
      fa: "چگونه جریان‌های WebSocket بدون افت فریم به رابط کاربری می‌رسند.",
      ar: "كيف تصل بثوث WebSocket إلى الواجهة دون تقطّع.",
    },
    COVER("chart"),
  ),
  post(
    "demo-nextjs-multilingual-blog",
    "engineering",
    ["nextjs", "react"],
    "2026-11-12",
    8,
    {
      en: "[Sample] Building a three-language blog with Next.js",
      fa: "[نمونه] ساخت وبلاگ سه‌زبانه با Next.js",
      ar: "[عينة] بناء مدونة ثلاثية اللغات باستخدام Next.js",
    },
    {
      en: "Locale routing, fallbacks and RTL in one codebase.",
      fa: "مسیریابی زبان، جایگزین‌ها و راست‌به‌چپ در یک کدبیس.",
      ar: "توجيه اللغات والبدائل والكتابة من اليمين لليسار في قاعدة شيفرة واحدة.",
    },
    COVER("code"),
  ),
];

interface DemoProject {
  slug: string;
  name: string;
  coverImageUrl: string | null;
  descriptionEn: string;
  descriptionFa: string;
  descriptionAr: string;
  overviewEn: string;
  overviewFa: string;
  overviewAr: string;
  isFeatured: boolean;
  order: number;
  kind: "research" | "tool";
  stage: "prototype" | "preProduction" | "live" | "openSource" | "archived";
  year: number | null;
  badges: ("personal" | "blockchain" | "desktop")[];
  stack: string[];
  url: string | null;
  sourceUrl: string | null;
}

const OVERVIEW = {
  overviewEn: "[Sample] Project overview text.",
  overviewFa: "[نمونه] متن معرفی پروژه.",
  overviewAr: "[عينة] نص تعريف المشروع.",
};

export const DEMO_PROJECTS: DemoProject[] = [
  {
    slug: "pactus-gui",
    name: "Pactus GUI",
    coverImageUrl: COVER("blocks"),
    descriptionEn: "Cross-platform blockchain node management app",
    descriptionFa: "برنامه‌ی چندسکویی مدیریت نود بلاک‌چین",
    descriptionAr: "تطبيق متعدد المنصات لإدارة عقدة البلوك تشين",
    ...OVERVIEW,
    isFeatured: true,
    order: 1,
    kind: "tool",
    stage: "openSource",
    year: 2024,
    badges: ["blockchain", "desktop"],
    stack: ["Flutter", "Dart", "gRPC"],
    url: null,
    sourceUrl: "https://github.com/pactus-project/pactus-gui",
  },
  {
    slug: "crypto-market-radar",
    name: "Crypto Market Radar",
    coverImageUrl: COVER("coin"),
    descriptionEn: "Customer-feedback signals for digital-asset teams",
    descriptionFa: "سیگنال‌های بازخورد مشتری برای تیم‌های دارایی دیجیتال",
    descriptionAr: "إشارات ملاحظات العملاء لفرق الأصول الرقمية",
    ...OVERVIEW,
    isFeatured: false,
    order: 2,
    kind: "research",
    stage: "preProduction",
    year: 2026,
    badges: ["personal"],
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Prisma", "PostgreSQL"],
    url: "https://radar.tarvix.org/?lang=en",
    sourceUrl: null,
  },
  {
    slug: "tarvix-market",
    name: "Tarvix Market",
    coverImageUrl: COVER("diamond"),
    descriptionEn: "Multi-branch grocery marketplace prototype",
    descriptionFa: "نمونه‌ی اولیه‌ی بازارچه‌ی چندشعبه‌ای خواروبار",
    descriptionAr: "نموذج أولي لسوق بقالة متعدد الفروع",
    ...OVERVIEW,
    isFeatured: false,
    order: 3,
    kind: "research",
    stage: "prototype",
    year: 2024,
    badges: ["personal"],
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Prisma", "PostgreSQL"],
    url: "https://market.tarvix.org",
    sourceUrl: null,
  },
  {
    slug: "codebridge",
    name: "CodeBridge",
    coverImageUrl: null, // no cover: shows the placeholder
    descriptionEn: "[Sample] description to be added",
    descriptionFa: "[نمونه] توضیح اضافه می‌شود",
    descriptionAr: "[عينة] سيُضاف الوصف",
    ...OVERVIEW,
    isFeatured: false,
    order: 4,
    kind: "tool",
    stage: "openSource",
    year: null,
    badges: [],
    stack: [],
    url: null,
    sourceUrl: "https://github.com/esmaeil-ahmadipour/CodeBridge",
  },
];

/** Optional project <-> post links. Projects without an entry simply have no articles. */
export const PROJECT_POST_LINKS: { project: string; post: string }[] = [
  { project: "pactus-gui", post: "flutter-clean-architecture-patterns" },
  { project: "pactus-gui", post: "web3-development-best-practices" },
  { project: "tarvix-market", post: "demo-nextjs-multilingual-blog" },
];

interface DemoIssue {
  number: number;
  linkedinUrl: string;
  coverImageUrl: string | null;
  publishedAt: string;
  readingTimeMin: number;
  categorySlug: string;
  tagSlugs: string[];
  titleEn: string;
  titleFa: string;
  titleAr: string;
  excerptEn: string;
  excerptFa: string;
  excerptAr: string;
  contentEn: string;
  contentFa: string;
  contentAr: string;
}

function issue(
  number: number,
  linkedinUrl: string,
  publishedAt: string,
  readingTimeMin: number,
  categorySlug: string,
  tagSlugs: string[],
  fa: string,
  ar: string,
  coverImageUrl: string | null = null,
): DemoIssue {
  const excerpt: Tri = {
    en: "[Sample] Short summary of the issue.",
    fa: "[نمونه] خلاصه‌ی کوتاه شماره.",
    ar: "[عينة] ملخص قصير للعدد.",
  };
  return {
    number,
    linkedinUrl,
    coverImageUrl,
    publishedAt,
    readingTimeMin,
    categorySlug,
    tagSlugs,
    titleEn: `[Sample] Issue ${number}`,
    titleFa: `[نمونه] شماره‌ی ${fa}`,
    titleAr: `[عينة] العدد ${ar}`,
    excerptEn: excerpt.en,
    excerptFa: excerpt.fa,
    excerptAr: excerpt.ar,
    ...body(excerpt),
  };
}

export const DEMO_ISSUES: DemoIssue[] = [
  issue(1, "https://www.linkedin.com/pulse/architecture-decisions-directories-esmaeil-ahmadipour-8rrme/", "2026-08-15", 4, "engineering", ["flutter"], "۱", "١", COVER("coin")),
  issue(2, "https://www.linkedin.com/pulse/why-delivery-slows-down-code-bases-grow-where-real-esmaeil-ahmadipour-vxufe/", "2026-09-15", 5, "architecture", ["architecture"], "۲", "٢", COVER("shield")),
  issue(3, "https://www.linkedin.com/pulse/riverpod-30-vs-bloc-wrong-debate-esmaeil-ahmadipour-ogo1e/", "2026-10-15", 6, "web3", ["web3", "blockchain"], "۳", "٣", COVER("diamond")),
];
