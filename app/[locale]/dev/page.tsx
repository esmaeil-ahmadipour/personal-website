// app/[locale]/dev/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { EarlyAccessModal, EarlyAccessTrigger } from "@/features/early-access";
import LanguageSwitcher from "@/components/SwitchLanguage";
import ThemeSwitcherWrapper from "@/features/shared/components/ThemeSwitcherWrapper";
import Logo from "@/components/Logo";
import Navbar from "@/features/shared/components/Navbar";
import {
  HomeIcon,
  CapabilitiesIcon,
  WorkIcon,
  BlogIcon,
  TeamIcon,
  ContactIcon,
} from "@/features/shared/icons";

// ============================================
// DEV NAVIGATION ITEMS - مخصوص صفحه Dev
// ============================================
const DEV_NAV_ITEMS = [
  {
    id: "dev-why",
    label: "Why",
    href: "#why",
    icon: <CapabilitiesIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "dev-substance",
    label: "Substance",
    href: "#substance",
    icon: <WorkIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "dev-layers",
    label: "Layers",
    href: "#layers",
    icon: <BlogIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "dev-principles",
    label: "Principles",
    href: "#principles",
    icon: <TeamIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "dev-access",
    label: "Access",
    href: "#access",
    icon: <ContactIcon className="w-4.5 h-4.5" />,
  },
];

// ============================================
// OFFICIAL COLOR PALETTE - Blue, Purple, Green
// با opacity بالاتر برای تم روشن
// ============================================
const OFFICIAL_COLORS = [
  {
    // 0 - Blue
    name: "Blue",
    gradient: "from-blue-500/40 via-blue-400/20 to-transparent",
    border: "border-blue-500 hover:border-blue-700",
    borderStrong: "border-blue-600",
    shadow: "shadow-blue-500/10 hover:shadow-blue-500/25",
    text: "text-blue-600 dark:text-blue-300",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    badgeBg: "bg-blue-600",
    badgeColor: "text-white",
    badgeBorder: "border-blue-700",
  },
  {
    // 1 - Purple
    name: "Purple",
    gradient: "from-purple-500/40 via-purple-400/20 to-transparent",
    border: "border-purple-500 hover:border-purple-700",
    borderStrong: "border-purple-600",
    shadow: "shadow-purple-500/10 hover:shadow-purple-500/25",
    text: "text-purple-600 dark:text-purple-300",
    iconBg: "bg-purple-600",
    iconColor: "text-white",
    badgeBg: "bg-purple-600",
    badgeColor: "text-white",
    badgeBorder: "border-purple-700",
  },
  {
    // 2 - Green
    name: "Green",
    gradient: "from-emerald-500/40 via-emerald-400/20 to-transparent",
    border: "border-emerald-500 hover:border-emerald-700",
    borderStrong: "border-emerald-600",
    shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/25",
    text: "text-emerald-600 dark:text-emerald-300",
    iconBg: "bg-emerald-600",
    iconColor: "text-white",
    badgeBg: "bg-emerald-600",
    badgeColor: "text-white",
    badgeBorder: "border-emerald-700",
  },
  {
    // 3 - Blue (Alternate)
    name: "Blue Alt",
    gradient: "from-blue-600/40 via-blue-500/20 to-transparent",
    border: "border-blue-600 hover:border-blue-800",
    borderStrong: "border-blue-700",
    shadow: "shadow-blue-600/10 hover:shadow-blue-600/25",
    text: "text-blue-700 dark:text-blue-200",
    iconBg: "bg-blue-700",
    iconColor: "text-white",
    badgeBg: "bg-blue-700",
    badgeColor: "text-white",
    badgeBorder: "border-blue-800",
  },
  {
    // 4 - Purple (Alternate)
    name: "Purple Alt",
    gradient: "from-purple-600/40 via-purple-500/20 to-transparent",
    border: "border-purple-600 hover:border-purple-800",
    borderStrong: "border-purple-700",
    shadow: "shadow-purple-600/10 hover:shadow-purple-600/25",
    text: "text-purple-700 dark:text-purple-200",
    iconBg: "bg-purple-700",
    iconColor: "text-white",
    badgeBg: "bg-purple-700",
    badgeColor: "text-white",
    badgeBorder: "border-purple-800",
  },
  {
    // 5 - Green (Alternate)
    name: "Green Alt",
    gradient: "from-emerald-600/40 via-emerald-500/20 to-transparent",
    border: "border-emerald-600 hover:border-emerald-800",
    borderStrong: "border-emerald-700",
    shadow: "shadow-emerald-600/10 hover:shadow-emerald-600/25",
    text: "text-emerald-700 dark:text-emerald-200",
    iconBg: "bg-emerald-700",
    iconColor: "text-white",
    badgeBg: "bg-emerald-700",
    badgeColor: "text-white",
    badgeBorder: "border-emerald-800",
  },
];

export default function DevPlatformPage() {
  const { t, locale, isRTL } = useTranslation();

  return (
    <>
      <Navbar navItems={DEV_NAV_ITEMS} showBack backUrl="/" />

      {/* ============================================
          Hero Section
          ============================================ */}
      <section id="dev-dashboard" className="relative pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wider">
              Engineering System
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="gradient-text">The Tarvix Engineering System</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-6 leading-relaxed">
            A modular, production-grade platform designed for scale,
            maintainability, and developer experience.
          </p>

          <div className="max-w-2xl mx-auto text-sm text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 mb-8">
            <span className="text-emerald-500 mr-2">✓</span>
            Built with Next.js 16, TypeScript 5, Prisma, and Tailwind CSS
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <EarlyAccessTrigger className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press">
              Explore the System ↓
            </EarlyAccessTrigger>
            <a
              href="#layers"
              className="px-8 py-4 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] font-medium transition-all btn-press"
            >
              View Layers →
            </a>
          </div>
        </div>
      </section>

      {/* ============================================
          Why This System Exists
          ============================================ */}
      <section
        id="why"
        className="py-16 px-4 border-t border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Why This System Exists
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                badge: "Complexity",
                text: "Modern applications demand modular, scalable architectures. This system was built to handle complex business logic while maintaining clarity and developer velocity.",
                colorIndex: 0,
              },
              {
                badge: "Consistency",
                text: "From authentication to database operations, every layer follows the same patterns. This reduces cognitive load and makes onboarding seamless.",
                colorIndex: 1,
              },
            ].map((item, idx) => {
              const color =
                OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    rounded-2xl p-6
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
                  <span
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full
                      text-[10px] font-mono font-semibold tracking-wider uppercase
                      ${color.badgeBg} ${color.badgeColor}
                      border ${color.badgeBorder}
                    `}
                  >
                    {item.badge}
                  </span>
                  <p className="text-[var(--text-secondary)] mt-3 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[var(--text-muted)] mt-6 text-sm">
            This isn't just another boilerplate — it's a battle-tested
            foundation for enterprise applications.
          </p>
        </div>
      </section>

      {/* ============================================
          Substance Section
          ============================================ */}
      <section
        id="substance"
        className="py-16 px-4 border-t border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 gradient-text">
            System Substance
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12">
            What makes this system different from the rest.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                text: "Every feature is isolated in its own directory with clear boundaries. Components, hooks, services, and schemas are co-located for maximum cohesion.",
                colorIndex: 2,
              },
              {
                text: "Authentication is handled via JWT with httpOnly cookies. Role-based access control (RBAC) is enforced at both middleware and API levels.",
                colorIndex: 3,
              },
            ].map((item, idx) => {
              const color =
                OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    rounded-2xl p-6
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-2xl p-6 bg-[var(--accent-blue-bg)] border border-[var(--accent-blue)]/10 text-center">
            <p className="text-[var(--text-primary)] font-medium">
              Principle: "Write code that is easy to delete, not easy to
              extend."
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          System Layers
          ============================================ */}
      <section
        id="layers"
        className="py-16 px-4 border-t border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 gradient-text">
            System Layers
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12">
            A clean, layered architecture that separates concerns.
          </p>
          <div className="space-y-4">
            {[
              {
                title: "Presentation Layer",
                content:
                  "Next.js App Router with React Server Components. Pages, layouts, and client components live here. All UI logic is isolated from business logic.",
                colorIndex: 0,
              },
              {
                title: "Feature Layer",
                content:
                  "Domain-driven modules under `src/features/`. Each feature contains its own components, hooks, services, schemas, and types. Features are isolated and communicate through explicit public APIs.",
                colorIndex: 1,
              },
              {
                title: "Infrastructure Layer",
                content:
                  "Shared utilities in `src/lib/` including API clients, authentication, database connections, and error handling. This layer is framework-agnostic.",
                colorIndex: 2,
              },
              {
                title: "Data Layer",
                content:
                  "Prisma ORM with PostgreSQL. All database operations are type-safe and managed through repositories. Migrations are version-controlled.",
                footer:
                  "→ Every layer has a single responsibility and a single reason to change.",
                colorIndex: 3,
              },
            ].map((layer, idx) => {
              const color =
                OFFICIAL_COLORS[layer.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    rounded-2xl p-6
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {layer.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {layer.content}
                  </p>
                  {layer.footer && (
                    <p className="text-sm text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--border-subtle)]">
                      {layer.footer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          Operating Principles
          ============================================ */}
      <section
        id="principles"
        className="py-16 px-4 border-t border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Operating Principles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                badge: "01",
                title: "Separation of Concerns",
                text: "Each layer has one responsibility. UI components never touch the database. Services never handle HTTP responses.",
                colorIndex: 0,
              },
              {
                badge: "02",
                title: "Type Safety First",
                text: "TypeScript is strictly enforced. No 'any' types. Prisma ensures type-safe database operations. Zod validates all inputs.",
                colorIndex: 1,
              },
              {
                badge: "03",
                title: "Security by Design",
                text: "JWT authentication, RBAC, rate limiting, audit logging, and input validation are built into every layer.",
                colorIndex: 2,
              },
            ].map((principle, idx) => {
              const color =
                OFFICIAL_COLORS[principle.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    rounded-2xl p-6
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
                  <span
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full
                      text-[10px] font-mono font-semibold tracking-wider uppercase
                      ${color.badgeBg} ${color.badgeColor}
                      border ${color.badgeBorder}
                    `}
                  >
                    {principle.badge}
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {principle.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          Explore the Engineering System
          ============================================ */}
      <section
        id="access"
        className="py-16 px-4 border-t border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 gradient-text">
            Explore the Engineering System
          </h2>
          <p className="text-center text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
            Dive into the codebase, inspect implementations, and see how
            everything fits together.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "fa-book",
                title: "Developer Guide",
                text: "Complete technical documentation covering architecture, standards, and best practices.",
                link: "/docs",
                colorIndex: 0,
              },
              {
                icon: "fa-github",
                title: "Source Code",
                text: "Browse the repository, explore features, and see how each layer is implemented.",
                link: "https://github.com",
                colorIndex: 1,
              },
              {
                icon: "fa-microphone-alt",
                title: "Request a Review",
                text: "Schedule a walkthrough with the engineering team to review the system.",
                link: "Request Access",
                colorIndex: 2,
                isTrigger: true,
              },
            ].map((item, idx) => {
              const color =
                OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    text-center p-6 rounded-2xl
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
                  <div
                    className={`
                      w-14 h-14 rounded-xl
                      flex items-center justify-center mx-auto
                      ${color.iconBg} ${color.iconColor}
                      mb-4 shadow-md
                    `}
                  >
                    <i className={`fas ${item.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-[var(--text-primary)] font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2">
                    {item.text}
                  </p>
                  {item.isTrigger ? (
                    <EarlyAccessTrigger
                      className={`
                        inline-block mt-4 text-sm font-medium
                        ${color.text} hover:${color.text}
                        transition-colors cursor-pointer
                      `}
                    >
                      {item.link} →
                    </EarlyAccessTrigger>
                  ) : (
                    <a
                      href={item.link}
                      className={`
                        inline-block mt-4 text-sm font-medium
                        ${color.text} hover:${color.text}
                        transition-colors
                      `}
                    >
                      {item.link} →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center text-sm text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 max-w-3xl mx-auto">
            <span className="text-blue-500 mr-2">💡</span>
            "The best way to understand the system is to run it locally.
            <br className="sm:hidden" />{" "}
            <code className="px-2 py-1 bg-[var(--bg-primary)] rounded text-xs font-mono">
              pnpm dev
            </code>
            "
          </div>
        </div>
      </section>

      {/* ============================================
          Final CTA
          ============================================ */}
      <section className="py-16 px-4 border-t border-[var(--border-subtle)]">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-8 bg-[var(--accent-blue-bg)] border border-[var(--accent-blue)]/10">
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            Ready to build with Tarvix?
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Start by exploring the{" "}
            <Link href="/docs" className="text-blue-500 hover:underline">
              Developer Guide
            </Link>{" "}
            or{" "}
            <EarlyAccessTrigger className="text-blue-500 hover:underline cursor-pointer">
              request early access
            </EarlyAccessTrigger>
            .
          </p>
        </div>
      </section>

      {/* ============================================
          Footer
          ============================================ */}
      <footer className="border-t border-[var(--border-subtle)] py-8 px-4 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[var(--text-muted)]">
            © 2025 Tarvix — Built with Next.js, TypeScript, and ❤️
          </p>
          <p className="text-xs text-[var(--text-muted)]/70 mt-2">
            Engineering System v1.0 • Open Source • MIT License
          </p>
        </div>
      </footer>

      <EarlyAccessModal />
    </>
  );
}
