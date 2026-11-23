// prisma/seed/versions/v1.0.0.ts
//
// Initial system data: the author, categories and tags that the previous
// prisma/seed.ts created. The values below were moved verbatim from that file
// (see prisma/__tests__/fixtures/legacy-system-data.ts for the untouched copy
// that the unit tests compare against).
//
// One deliberate difference from the old script: every operation here is
// INSERT-ONLY (createMany + skipDuplicates). A row that already exists is left
// exactly as it is, so administrator edits are never overwritten. The old
// script re-wrote category and tag fields (including isActive) on every run.
//
// Sample blog posts are intentionally NOT part of the system seed; they move to
// file-managed content in a later phase.

import type { SeedVersion } from "../types";
import { describeInsert } from "../utils/helpers";

export const author = {
  slug: "esmaeil-ahmadipour",
  email: "esmaeil@tarvix.org",
  avatarUrl: "/images/authors/avatar-esmaeil.png",

  // فیلدهای جدید - شبکه‌های اجتماعی
  twitter: "https://twitter.com/esmaeil",
  github: "https://github.com/esmaeil-ahmadipour",
  website: "https://tarvix.org",
  linkedin: "https://linkedin.com/in/esmaeil-ahmadipour",

  // انگلیسی
  firstNameEn: "Esmaeil",
  lastNameEn: "Ahmadipour",
  bioEn:
    "Founder & Lead Frontend/Mobile Engineer with 8+ years in mobile and web development. Leads architecture and delivery for enterprise Flutter, React, and Next.js applications. Open source contributor and Pactus GUI manager.",

  // فارسی
  firstNameFa: "اسماعیل",
  lastNameFa: "احمدی‌پور",
  bioFa:
    "بنیان‌گذار و مهندس ارشد فرانت‌اند و موبایل با بیش از ۸ سال تجربه در توسعه موبایل و وب. رهبری معماری و تحویل برنامه‌های سازمانی فلاتر، React و Next.js. مشارکت‌کننده متن‌باز و مدیر GUI Pactus.",

  // عربی
  firstNameAr: "إسماعیل",
  lastNameAr: "أحمدي‌بور",
  bioAr:
    "مؤسس ومهندس رئيسي للواجهة الأمامية والهواتف المحمولة مع أكثر من 8 سنوات من الخبرة في تطوير الهواتف المحمولة والويب. يقود الهندسة المعمارية وتسليم تطبيقات المؤسسات Flutter و React و Next.js. مساهم في المصادر المفتوحة ومدير واجهة Pactus.",
};

export const categories = [
  {
    slug: "engineering",
    order: 1,
    isActive: true,
    nameEn: "Engineering",
    descriptionEn: "Software engineering insights and best practices",
    nameFa: "مهندسی نرم‌افزار",
    descriptionFa: "نکات و تجربیات مهندسی نرم‌افزار و بهترین روش‌ها",
    nameAr: "الهندسة",
    descriptionAr: "رؤى هندسة البرمجيات وأفضل الممارسات",
  },
  {
    slug: "architecture",
    order: 2,
    isActive: true,
    nameEn: "Architecture",
    descriptionEn: "System architecture and design patterns",
    nameFa: "معماری",
    descriptionFa: "معماری سیستم و الگوهای طراحی",
    nameAr: "الهندسة المعمارية",
    descriptionAr: "هندسة النظم وأنماط التصميم",
  },
  {
    slug: "flutter",
    order: 3,
    isActive: true,
    nameEn: "Flutter",
    descriptionEn: "Flutter development tips and techniques",
    nameFa: "فلاتر",
    descriptionFa: "نکات و تکنیک‌های توسعه فلاتر",
    nameAr: "فلاتر",
    descriptionAr: "نصائح وتقنيات تطوير فلاتر",
  },
  {
    slug: "web3",
    order: 4,
    isActive: true,
    nameEn: "Web3",
    descriptionEn: "Blockchain and Web3 development",
    nameFa: "وب۳",
    descriptionFa: "توسعه بلاکچین و وب۳",
    nameAr: "ويب 3",
    descriptionAr: "تطوير البلوكشين والويب 3",
  },
];

export const tags = [
  {
    slug: "flutter",
    nameEn: "Flutter",
    nameFa: "فلاتر",
    nameAr: "فلاتر",
    color: "#42a5f5",
    icon: "smartphone",
  },
  {
    slug: "architecture",
    nameEn: "Architecture",
    nameFa: "معماری",
    nameAr: "الهندسة المعمارية",
    color: "#7c3aed",
    icon: "layers",
  },
  {
    slug: "nextjs",
    nameEn: "Next.js",
    nameFa: "نکست‌جی‌اس",
    nameAr: "نيكست جي إس",
    color: "#000000",
    icon: "code",
  },
  {
    slug: "react",
    nameEn: "React",
    nameFa: "ری‌اکت",
    nameAr: "رياكت",
    color: "#61dafb",
    icon: "atom",
  },
  {
    slug: "web3",
    nameEn: "Web3",
    nameFa: "وب۳",
    nameAr: "ويب 3",
    color: "#3b82f6",
    icon: "globe",
  },
  {
    slug: "blockchain",
    nameEn: "Blockchain",
    nameFa: "بلاکچین",
    nameAr: "بلوكشين",
    color: "#f59e0b",
    icon: "link",
  },
  {
    slug: "clean-architecture",
    nameEn: "Clean Architecture",
    nameFa: "معماری تمیز",
    nameAr: "الهندسة النظيفة",
    color: "#10b981",
    icon: "archive",
  },
  {
    slug: "typescript",
    nameEn: "TypeScript",
    nameFa: "تایپ‌اسکریپت",
    nameAr: "تايب سكريبت",
    color: "#3178c6",
    icon: "file-code",
  },
  {
    slug: "productivity",
    nameEn: "Productivity",
    nameFa: "بهره‌وری",
    nameAr: "الإنتاجية",
    color: "#8b5cf6",
    icon: "zap",
  },
];

export const v1_0_0: SeedVersion = {
  version: "v1.0.0",
  description: "Initial system data: author, categories and tags (insert-only)",

  async run(tx, ctx) {
    const insertedAuthors = await tx.author.createMany({
      data: [author],
      skipDuplicates: true,
    });
    ctx.log.info(describeInsert("Author", insertedAuthors.count, 1));

    const insertedCategories = await tx.category.createMany({
      data: categories,
      skipDuplicates: true,
    });
    ctx.log.info(
      describeInsert("Category", insertedCategories.count, categories.length),
    );

    const insertedTags = await tx.tag.createMany({
      data: tags,
      skipDuplicates: true,
    });
    ctx.log.info(describeInsert("Tag", insertedTags.count, tags.length));
  },
};
