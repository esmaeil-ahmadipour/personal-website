// features/blog/types/blog.types.ts

import { PostStatus } from "@prisma/client";

export type Locale = "en" | "fa" | "ar";

// ============================================
// Author Type - Full Prisma Support
// ============================================
export interface Author {
  id: string;
  slug: string;
  email?: string | null;
  avatarUrl?: string | null;
  
  // Social links
  twitter?: string | null;
  github?: string | null;
  website?: string | null;
  linkedin?: string | null;
  
  // English
  firstNameEn: string;
  lastNameEn: string;
  bioEn?: string | null;
  
  // Persian
  firstNameFa: string;
  lastNameFa: string;
  bioFa?: string | null;
  
  // Arabic
  firstNameAr: string;
  lastNameAr: string;
  bioAr?: string | null;
  
  posts?: BlogPost[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Category Type - Full Prisma Support
// ============================================
export interface Category {
  id: string;
  slug: string;
  
  // Hierarchy
  order: number;
  parentId?: string | null;
  isActive: boolean;
  
  // English
  nameEn: string;
  descriptionEn?: string | null;
  
  // Persian
  nameFa: string;
  descriptionFa?: string | null;
  
  // Arabic
  nameAr: string;
  descriptionAr?: string | null;
  
  posts?: BlogPost[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Tag Type - Full Prisma Support
// ============================================
export interface Tag {
  id: string;
  slug: string;
  
  // UI fields
  color?: string | null;
  icon?: string | null;
  
  // English
  nameEn: string;
  
  // Persian
  nameFa: string;
  
  // Arabic
  nameAr: string;
  
  posts?: PostTag[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PostTag Type
// ============================================
export interface PostTag {
  postId: string;
  tagId: string;
  assignedAt: Date;
  post?: BlogPost;
  tag?: Tag;
}

// ============================================
// Post Type - Full Prisma Support
// ============================================
export interface BlogPost {
  id: string;
  slug: string;
  
  // Meta fields
  isFeatured: boolean;
  isTrending: boolean;
  isPinned: boolean;
  priority: number;
  language?: string | null;
  
  // English
  titleEn: string;
  excerptEn?: string | null;
  contentEn: string;
  seoTitleEn?: string | null;
  seoDescriptionEn?: string | null;
  keywordsEn?: string | null;
  ogImageEn?: string | null;
  
  // Persian
  titleFa: string;
  excerptFa?: string | null;
  contentFa: string;
  seoTitleFa?: string | null;
  seoDescriptionFa?: string | null;
  keywordsFa?: string | null;
  ogImageFa?: string | null;
  
  // Arabic
  titleAr: string;
  excerptAr?: string | null;
  contentAr: string;
  seoTitleAr?: string | null;
  seoDescriptionAr?: string | null;
  keywordsAr?: string | null;
  ogImageAr?: string | null;
  
  // Common fields
  coverImageUrl?: string | null;
  readingTimeMin?: number | null;
  status: PostStatus;
  publishedAt?: Date | null;
  
  // Engagement metrics
  views: number;
  likes: number;
  comments: number;
  
  // Relations
  authorId: string;
  categoryId: string;
  author: Author;
  category: Category;
  tags: PostTag[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API Response Types
// ============================================
export interface PostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  locale?: Locale;
  status?: PostStatus;
  category?: string;
  search?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  language?: string;
}

// ============================================
// Helper: Get localized field from Post
// ============================================
export function getLocalizedPostField<T extends BlogPost>(
  post: T,
  locale: Locale,
  field: 'title' | 'excerpt' | 'content' | 'seoTitle' | 'seoDescription' | 'keywords' | 'ogImage'
): string {
  const suffix = locale === 'en' ? 'En' : locale === 'fa' ? 'Fa' : 'Ar';
  const key = `${field}${suffix}` as keyof T;
  return (post[key] as string) || '';
}

// ============================================
// Helper: Get localized Author name
// ============================================
export function getLocalizedAuthorName(author: Author, locale: Locale): string {
  if (locale === 'fa') {
    return `${author.firstNameFa} ${author.lastNameFa}`;
  }
  if (locale === 'ar') {
    return `${author.firstNameAr} ${author.lastNameAr}`;
  }
  return `${author.firstNameEn} ${author.lastNameEn}`;
}

// ============================================
// Helper: Get localized Category name
// ============================================
export function getLocalizedCategoryName(category: Category, locale: Locale): string {
  if (locale === 'fa') return category.nameFa;
  if (locale === 'ar') return category.nameAr;
  return category.nameEn;
}

// ============================================
// Helper: Get localized Tag name
// ============================================
export function getLocalizedTagName(tag: Tag, locale: Locale): string {
  if (locale === 'fa') return tag.nameFa;
  if (locale === 'ar') return tag.nameAr;
  return tag.nameEn;
}

// ============================================
// Helper: Format date with locale support
// ============================================
export function formatDate(
  date: Date | string | null | undefined,
  locale: Locale = 'en'
): string {
  if (!date) return '';
  
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    fa: 'fa-IR',
    ar: 'ar-SA',
  };
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ============================================
// Helper: Get reading time label
// ============================================
export function getReadingTimeLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: 'min read',
    fa: 'دقیقه مطالعه',
    ar: 'دقيقة قراءة',
  };
  return labels[locale];
}

// ============================================
// Helper: Get views label
// ============================================
export function getViewsLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: 'views',
    fa: 'بازدید',
    ar: 'مشاهدة',
  };
  return labels[locale];
}
