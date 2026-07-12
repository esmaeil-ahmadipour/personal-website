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
import { Hero } from "@/features/early-access/components/Hero";
import { WhySection } from "@/features/early-access/components/WhySection";
import { WhatSection } from "@/features/early-access/components/WhatSection";
import { LayersSection } from "@/features/early-access/components/LayersSection";
import { ReferencesSection } from "@/features/early-access/components/ReferencesSection";
import { BuiltFromSection } from "@/features/early-access/components/BuiltFromSection";
import { ExploreSection } from "@/features/early-access/components/ExploreSection";
import { HowWePartnerSection } from "@/features/early-access/components/HowWePartnerSection";
import { HandshakeIcon } from "@/components/icons/Handshake";
import Script from "next/script";

// ============================================
// DEV NAVIGATION ITEMS - مخصوص صفحه Dev
// ============================================
// app/[locale]/dev/page.tsx

// DEV NAVIGATION ITEMS - مخصوص صفحه Dev
// ============================================
const DEV_NAV_ITEMS = [
  {
    id: "dev-dashboard",
    label: "devNavDashboard",
    href: "#dev-dashboard",
    icon: <HomeIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "why",
    label: "devNavWhy",
    href: "#why",
    icon: <CapabilitiesIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "what", // ✅ changed from "substance"
    label: "devNavWhat", // ✅ new key
    href: "#what",
    icon: <WorkIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "how-we-partner", // ✅ NEW
    label: "devNavHowWePartner",
    href: "#how-we-partner",
    icon: <HandshakeIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "layers",
    label: "devNavLayers",
    href: "#layers",
    icon: <BlogIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "built-from", // ✅ new section
    label: "devNavBuiltFrom", // ✅ new key
    href: "#built-from",
    icon: <TeamIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "access",
    label: "devNavAccess",
    href: "#access",
    icon: <ContactIcon className="w-4.5 h-4.5" />,
  },
];

export default function DevPlatformPage() {
  const { t ,isRTL,locale} = useTranslation();
  const [activeSection, setActiveSection] = useState<string>("dev-dashboard");

  const SITE_URL = "https://tarvix.com";

  const currentUrl =
    locale === "en" ? `${SITE_URL}/dev` : `${SITE_URL}/${locale}/dev`;

  // ============================================
  // JSON-LD - برای صفحه Dev
  // ============================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("devPage.title") || "Tarvix Dev Platform",
    description:
      t("devPage.description") ||
      "Engineering platform for modern software development.",
    url: currentUrl,
    about: {
      "@type": "Thing",
      name: "Software Engineering Platform",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Dev Platform",
          item: currentUrl,
        },
      ],
    },
    mainEntity: {
      "@type": "CollectionPage",
      name: "Engineering Layers",
      description: "Tarvix engineering layers and development workflow",
    },
  };

  // ✅ تشخیص سکشن فعال
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0.1,
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      {/* JSON-LD */}
      <Script
        id="json-ld-dev"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar
        navItems={DEV_NAV_ITEMS}
        showBack
        backUrl="/"
        activeSection={activeSection}
      />

      {/* ============================================
          SECTIONS - با کامپوننت‌ها
          ============================================ */}

      {/* Hero */}
      <Hero />

      {/* Why */}
      <WhySection />

      {/* What */}
      <WhatSection />

      {/* How We Partner */}
      <HowWePartnerSection />

      {/* Layers */}
      <LayersSection />

      {/* References - NEW */}
      <ReferencesSection />

      {/* Built From */}
      <BuiltFromSection />

      {/* Explore / Access */}
      <ExploreSection />

      {/* ============================================
          Final CTA
          ============================================ */}
      <section className="py-16 px-4 border-t border-[var(--border-subtle)]">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-8 bg-[var(--accent-blue-bg)] border border-[var(--accent-blue)]/10">
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {t("finalTitle")}
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {t("finalText")}
          </p>
        </div>
      </section>

      {/* ============================================
          Footer
          ============================================ */}
      <footer className="border-t border-[var(--border-subtle)] py-8 px-4 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {t("footerNewTagline")}
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {t("footerNewBrand")}
          </p>
          <p className="text-xs text-[var(--text-muted)]/70 mt-3">
            {t("footerTags")}
          </p>
        </div>
      </footer>

      <EarlyAccessModal />
    </>
  );
}
