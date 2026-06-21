export interface Author {
  id: string;
  slug: string;
  firstNameEn: string;
  lastNameEn: string;
  bioEn?: string | null;
  firstNameFa: string;
  lastNameFa: string;
  bioFa?: string | null;
  avatarUrl?: string | null;
}

export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  descriptionEn?: string | null;
  nameFa: string;
  descriptionFa?: string | null;
}

export interface Tag {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  titleEn: string;
  excerptEn?: string | null;
  contentEn: string;
  seoTitleEn?: string | null;
  seoDescriptionEn?: string | null;
  titleFa: string;
  excerptFa?: string | null;
  contentFa: string;
  seoTitleFa?: string | null;
  seoDescriptionFa?: string | null;
  coverImageUrl?: string | null;
  readingTimeMin?: number | null;
  status: "draft" | "pending" | "published";
  publishedAt: Date | null;
  author: Author;
  category: Category;
  tags: Tag[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
