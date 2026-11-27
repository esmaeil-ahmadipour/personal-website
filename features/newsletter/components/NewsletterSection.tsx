// features/newsletter/components/NewsletterSection.tsx
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SliderControls } from "@/components/ui/SliderControls";
import { LINKEDIN_NEWSLETTER_URL } from "../config";
import { getPublishedIssues, type IssueSummary } from "../services/newsletter.service";
import { FollowSlideCard, IssueSlideCard } from "./IssueSlideCard";
import { NewsletterBandArt } from "./NewsletterBandArt";

const TRACK_ID = "newsletter-track";

export async function NewsletterSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  let issues: IssueSummary[];
  try {
    issues = await getPublishedIssues(locale, 3);
  } catch (error) {
    // A database failure hides only this section, not the whole home page.
    console.error("NewsletterSection: could not load issues", error);
    return null;
  }
  if (issues.length === 0) return null;

  return (
    <section id="newsletter" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 sm:px-8">
      <div className="overflow-hidden rounded-[20px] border border-[hsl(var(--accent-blue)/0.35)] bg-[hsl(var(--accent-blue)/0.12)] py-8 ps-6 sm:ps-8">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4 pe-6 sm:pe-8">
          <div>
            <h2 className="text-[28px] font-extrabold">{t("nlTitle")}</h2>
            <p className="mt-1 text-[hsl(var(--text-secondary))]">{t("nlSub")}</p>
            <ButtonLink href={LINKEDIN_NEWSLETTER_URL} external variant="ghost" className="mt-4">
              {t("nlFollowShort")} <span aria-hidden className="rtl-flip inline-block">→</span>
            </ButtonLink>
          </div>
          <div className="flex items-center gap-3">
            <ButtonLink href={`/${locale}/newsletter`} variant="ghost" size="sm">
              {t("nlArchive")} <span aria-hidden className="rtl-flip inline-block">→</span>
            </ButtonLink>
            <SliderControls targetId={TRACK_ID} prevLabel={t("slPrev")} nextLabel={t("slNext")} />
          </div>
        </div>

        <div className="flex items-center">
          <ul id={TRACK_ID} className="card-track min-w-0 flex-1 pe-6 sm:pe-8">
            {issues.map((issue) => (
              <li key={issue.number}>
                <IssueSlideCard issue={issue} locale={locale} />
              </li>
            ))}
            <li>
              <FollowSlideCard locale={locale} />
            </li>
          </ul>
          <div className="hidden w-[190px] flex-none place-items-center md:grid">
            <NewsletterBandArt />
          </div>
        </div>
      </div>
    </section>
  );
}
