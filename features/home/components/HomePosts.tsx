// features/home/components/HomePosts.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getHomePosts } from "../data/home-posts";
import { PostCard } from "./PostCard";

type Locale = "en" | "fa" | "ar";

export async function HomePosts({ locale }: { locale: Locale }) {
  const [t, posts] = await Promise.all([
    getTranslations({ locale }),
    getHomePosts(locale, 4),
  ]);

  if (posts.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-[hsl(var(--text-muted))]">{t("hmEmpty")}</p>
      </section>
    );
  }

  const [featured, ...latest] = posts;

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <PostCard post={featured} locale={locale} index={0} variant="featured" />
      </section>

      {latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold">{t("hmLatest")}</h2>
            <Link
              href={`/${locale}/blog`}
              className="text-sm font-semibold text-[hsl(var(--accent))] hover:underline"
            >
              {t("hmAll")} <span aria-hidden className="rtl-flip inline-block">→</span>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post, i) => (
              <PostCard key={post.id} post={post} locale={locale} index={i + 1} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
