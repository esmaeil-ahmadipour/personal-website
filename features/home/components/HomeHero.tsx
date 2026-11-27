// features/home/components/HomeHero.tsx
import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeaderArt } from "@/components/ui/HeaderArt";
import { Pill } from "@/components/ui/Pill";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export async function HomeHero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });

  return (
    <section className="relative isolate mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-8 md:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="orb animate-float start-[5%] top-4 h-[420px] w-[420px] bg-[hsl(var(--accent-blue)/0.1)]" />
        <div className="orb animate-float-slow end-[5%] top-56 h-[420px] w-[420px] bg-[hsl(var(--accent-purple)/0.1)]" />
        <div className="orb animate-float-slow start-[30%] top-0 h-[600px] w-[600px] bg-[hsl(var(--accent-cyan)/0.05)]" />
      </div>

      <div className="hx-header">
        <Pill className="animate-fade-up">{t("hmKicker")}</Pill>
        <h1
          className="animate-fade-up my-5 max-w-[880px] text-4xl sm:text-5xl lg:text-6xl"
          style={delay(0.05)}
        >
          {t("hmTitleLead")}{" "}
          <span className="text-[hsl(var(--accent-text))]">{t("hmTitleAccent")}</span>
        </h1>
        <p
          className="animate-fade-up mb-8 max-w-[680px] text-[19px] text-[hsl(var(--text-secondary))]"
          style={delay(0.1)}
        >
          {t("hmSub")}
        </p>

        <div className="animate-fade-up flex flex-wrap gap-3.5" style={delay(0.2)}>
          <ButtonLink href={`/${locale}/blog`}>{t("hmCtaStart")}</ButtonLink>
          <ButtonLink href={`/${locale}/projects`} variant="ghost">
            {t("hmCtaProjects")}
          </ButtonLink>
        </div>

        <HeaderArt variant="home" />
      </div>
    </section>
  );
}
