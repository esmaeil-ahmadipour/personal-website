// features/home/components/HomePosts.tsx
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHead } from "@/components/ui/SectionHead";
import { SliderControls } from "@/components/ui/SliderControls";
import { getHomePosts } from "../data/home-posts";
import { PostSlideCard } from "./PostSlideCard";

type Locale = "en" | "fa" | "ar";

const TRACK_ID = "latest-posts-track";

export async function HomePosts({ locale }: { locale: Locale }) {
  const [t, posts] = await Promise.all([
    getTranslations({ locale }),
    getHomePosts(locale, 6),
  ]);

  if (posts.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-8">
        <p className="text-[hsl(var(--text-muted))]">{t("hmEmpty")}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-8">
      <SectionHead title={t("hmLatest")}>
        <ButtonLink href={`/${locale}/blog`} variant="ghost" size="sm">
          {t("hmAll")} <span aria-hidden className="rtl-flip inline-block">→</span>
        </ButtonLink>
        <SliderControls targetId={TRACK_ID} prevLabel={t("slPrev")} nextLabel={t("slNext")} />
      </SectionHead>

      <ul id={TRACK_ID} className="card-track">
        {posts.map((post) => (
          <li key={post.id}>
            <PostSlideCard post={post} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}
