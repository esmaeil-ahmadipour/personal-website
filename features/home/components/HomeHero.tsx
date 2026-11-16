// features/home/components/HomeHero.tsx
import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Pill } from "@/components/ui/Pill";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export async function HomeHero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const chips = [t("hmChip1"), t("hmChip2"), t("hmChip3"), t("hmChip4")];

  return (
    <section className="relative isolate mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-8 md:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="orb animate-float start-[5%] top-4 h-[420px] w-[420px] bg-[hsl(var(--accent-blue)/0.1)]" />
        <div className="orb animate-float-slow end-[5%] top-56 h-[420px] w-[420px] bg-[hsl(var(--accent-purple)/0.1)]" />
        <div className="orb animate-float-slow start-[30%] top-0 h-[600px] w-[600px] bg-[hsl(var(--accent-cyan)/0.05)]" />
      </div>

      <Pill className="animate-fade-up">{t("hmKicker")}</Pill>
      <h1
        className="animate-fade-up my-5 max-w-[880px] text-4xl sm:text-5xl lg:text-6xl"
        style={delay(0.05)}
      >
        {t("hmTitle")}
      </h1>
      <p
        className="animate-fade-up mb-7 max-w-[680px] text-[19px] text-[hsl(var(--text-secondary))]"
        style={delay(0.1)}
      >
        {t("hmSub")}
      </p>

      <ul className="animate-fade-up mb-8 flex flex-wrap gap-2.5" style={delay(0.15)}>
        {chips.map((chip) => (
          <li key={chip}>
            <Pill>{chip}</Pill>
          </li>
        ))}
      </ul>

      <div className="animate-fade-up flex flex-wrap gap-3.5" style={delay(0.2)}>
        <ButtonLink href={`/${locale}/blog`}>{t("hmCtaRead")}</ButtonLink>
        <ButtonLink href={`/${locale}/newsletter`} variant="ghost">
          {t("hmCtaNews")}
        </ButtonLink>
      </div>
    </section>
  );
}
