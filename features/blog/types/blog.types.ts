// features/blog/types/blog.types.ts

export interface Author {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  readingTimeMin?: number | null;
  status: "draft" | "pending" | "published";
  publishedAt?: Date | null;
  author: Author;
  category: Category;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostsResponse {
  items: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  locale?: "en" | "fa" | "ar";
  /** Matches title or excerpt in any of the three languages. */
  q?: string;
  /** Category slug. */
  category?: string;
  sort?: "oldest" | "newest";
}