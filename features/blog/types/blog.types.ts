export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  email?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
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
}