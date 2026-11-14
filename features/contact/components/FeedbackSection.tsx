// features/contact/components/FeedbackSection.tsx
import { getTranslations } from "next-intl/server";
import { ContactForm } from "./ContactForm";

export async function FeedbackSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  return (
    <section id="feedback" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-10 sm:px-6">
      <h2 className="text-2xl font-bold">{t("fbTitle")}</h2>
      <p className="mb-6 mt-1 text-[hsl(var(--text-secondary))]">{t("fbSub")}</p>
      <div className="card relative p-5 sm:p-6">
        <ContactForm />
      </div>
    </section>
  );
}
