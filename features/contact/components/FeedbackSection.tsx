// features/contact/components/FeedbackSection.tsx
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { ContactForm } from "./ContactForm";

export async function FeedbackSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  return (
    <Reveal
      as="section"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 sm:px-8"
    >
      <div id="feedback" className="scroll-mt-28">
        <SectionHead title={t("fbTitle")} sub={t("fbSub")} />
        <div className="card relative max-w-[824px] p-6 hover:transform-none sm:p-9">
          <ContactForm />
        </div>
      </div>
    </Reveal>
  );
}
