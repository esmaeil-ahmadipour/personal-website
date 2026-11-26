// features/blog/services/post-numbers.ts
import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Article number (#01 is the oldest): the rank by publishedAt among all published
 * posts, so filtering and sorting never change it.
 */
export async function getPostNumbers(): Promise<Map<string, number>> {
  const rows = await prisma.post.findMany({
    where: { status: "published", publishedAt: { not: null } },
    orderBy: [{ publishedAt: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  return new Map(rows.map((row, index) => [row.id, index + 1]));
}
