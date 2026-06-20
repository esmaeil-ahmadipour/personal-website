"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { ContactForm } from "@/features/contact";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className="py-24 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent-amber)] bg-[var(--accent-amber)]/10 px-4 py-1.5 rounded-full border border-[var(--accent-amber)]/10 mb-4">
            {t("contact")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            <span className="gradient-text">{t("contactTitle")}</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            {t("contactDesc")}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <ContactForm />
          </div>
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-6 h-full transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {t("auditTitle")}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {t("auditDesc")}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-blue-hover)] transition-colors"
              >
                {t("auditCTA")} →
              </a>
              <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)]">
                  📧 contact@tarvix.org
                </p>
                <div className="flex gap-4 mt-3">
                  <a
                    href="#"
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <i className="fab fa-github text-lg"></i>
                  </a>
                  <a
                    href="#"
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <i className="fab fa-x text-lg"></i>
                  </a>
                  <a
                    href="#"
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <i className="fab fa-linkedin text-lg"></i>
                  </a>
                  <a
                    href="#"
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <i className="fab fa-telegram text-lg"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
