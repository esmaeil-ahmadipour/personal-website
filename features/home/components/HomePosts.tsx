// features/home/components/HomePosts.tsx
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHead } from "@/components/ui/SectionHead";
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
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-8">
        <p className="text-[hsl(var(--text-muted))]">{t("hmEmpty")}</p>
      </section>
    );
  }

  const [featured, ...latest] = posts;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-8">
      <SectionHead title={t("hmLatest")}>
        <ButtonLink href={`/${locale}/blog`} variant="ghost" size="sm">
          {t("hmAll")} <span aria-hidden className="rtl-flip inline-block">→</span>
        </ButtonLink>
      </SectionHead>

      <div className="mb-6">
        <PostCard post={featured} locale={locale} index={0} variant="featured" />
      </div>

      {latest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post, i) => (
            <PostCard key={post.id} post={post} locale={locale} index={i + 1} />
          ))}
        </div>
      )}
    </section>
  );
}
