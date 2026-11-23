// features/newsletter/components/NewsletterSection.tsx
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHead } from "@/components/ui/SectionHead";
import { LINKEDIN_NEWSLETTER_URL, getLatestIssues } from "../data/issues";
import { IssueRow } from "./IssueRow";

export async function NewsletterSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const issues = getLatestIssues(3);
  if (issues.length === 0) return null;

  return (
    <section id="newsletter" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 sm:px-8">
      <SectionHead title={t("nlTitle")} sub={t("nlSub")}>
        <ButtonLink href={LINKEDIN_NEWSLETTER_URL} external size="sm">
          {t("nlSubscribe")}
        </ButtonLink>
        <ButtonLink href={`/${locale}/newsletter`} variant="ghost" size="sm">
          {t("nlArchive")} <span aria-hidden className="rtl-flip inline-block">→</span>
        </ButtonLink>
      </SectionHead>

      <ul className="flex flex-col gap-3.5">
        {issues.map((issue, i) => (
          <IssueRow key={issue.number} issue={issue} locale={locale} index={i} />
        ))}
      </ul>
    </section>
  );
}
