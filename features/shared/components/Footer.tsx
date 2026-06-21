// features/shared/components/Footer.tsx

"use client";

import Link from "next/link";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Mobile: 2 columns | Desktop: 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pb-8 border-b border-[var(--border-subtle)]">
          {/* Brand - Full width on mobile, 1 column on desktop */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex-shrink-0">
                T
              </div>
              <span className="text-lg font-bold gradient-text">Tarvix</span>
            </Link>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              Architecture-first engineering studio for fintech, Web3, and SaaS
              products
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 md:mb-4">
              Product
            </h4>
            <ul className="space-y-2 md:space-y-2.5">
              <li>
                <Link
                  href="#services"
                  className="text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {t("capabilities")}
                </Link>
              </li>
              <li>
                <Link
                  href="#portfolio"
                  className="text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {t("work")}
                </Link>
              </li>
              <li>
                <Link
                  href="#package"
                  className="text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {t("foundation")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 md:mb-4">
              Company
            </h4>
            <ul className="space-y-2 md:space-y-2.5">
              <li>
                <Link
                  href="#about"
                  className="text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#careers"
                  className="text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 md:mb-4">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <a
                href="#"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-all duration-200 flex-shrink-0"
                aria-label="GitHub"
              >
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-all duration-200 flex-shrink-0"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-all duration-200 flex-shrink-0"
                aria-label="Twitter"
              >
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-all duration-200 flex-shrink-0"
                aria-label="Telegram"
              >
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8">
          {/* Desktop: flex row */}
          <div className="hidden md:flex items-center justify-between">
            <p className="text-xs text-[var(--text-muted)]">
              © 2026 Tarvix. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span>Modular Architecture</span>
              <span>•</span>
              <span>Living Standards</span>
              <span>•</span>
              <span>Quality Gates</span>
              <span>•</span>
              <span>Reference Implementations</span>
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="md:hidden flex flex-col items-center gap-3">
            <p className="text-[10px] text-[var(--text-muted)] text-center">
              © 2026 Tarvix. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-[var(--text-muted)]">
              <span>Modular Architecture</span>
              <span>•</span>
              <span>Living Standards</span>
              <span>•</span>
              <span>Quality Gates</span>
              <span>•</span>
              <span>Reference Implementations</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
