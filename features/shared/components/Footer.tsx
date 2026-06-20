"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-subtle)] py-12 px-4 bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
              <span className="text-lg font-bold gradient-text">Tarvix</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
              Architecture-first engineering studio for fintech, Web3, and SaaS
              products.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              {[t("capabilities"), t("work"), t("foundation"), t("team")].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {["About", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
              Connect
            </h4>
            <div className="flex gap-4">
              {[
                { label: "GitHub", icon: "fa-github" },
                { label: "Twitter", icon: "fa-x" },
                { label: "LinkedIn", icon: "fa-linkedin" },
                { label: "Telegram", icon: "fa-telegram" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all"
                  aria-label={social.label}
                >
                  <i className={`fab ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {currentYear} Tarvix. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">{t("footerTags")}</p>
        </div>
      </div>
    </footer>
  );
}
