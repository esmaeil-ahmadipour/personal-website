// features/home/components/HomeHero.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function HomeHero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const chips = [t("hmChip1"), t("hmChip2"), t("hmChip3"), t("hmChip4")];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 md:pt-24">
      <p className="text-sm font-semibold text-[hsl(var(--accent))]">
        {t("hmKicker")}
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
        {t("hmTitle")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--text-secondary))]">
        {t("hmSub")}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
        {chips.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-[hsl(var(--border-strong))] px-3 py-1 text-sm text-[hsl(var(--text-secondary))]"
          >
            {chip}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex h-11 items-center rounded-lg bg-[hsl(var(--accent))] px-6 text-sm font-semibold text-[hsl(var(--accent-ink))] transition-colors hover:bg-[hsl(var(--accent-hover))]"
        >
          {t("hmCtaRead")}
        </Link>
        <Link
          href={`/${locale}/newsletter`}
          className="inline-flex h-11 items-center rounded-lg border border-[hsl(var(--border-strong))] px-6 text-sm font-semibold text-[hsl(var(--text-primary))] transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
        >
          {t("hmCtaNews")}
        </Link>
      </div>
    </section>
  );
}
