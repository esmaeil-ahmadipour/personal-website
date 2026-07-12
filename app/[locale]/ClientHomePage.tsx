"use client";

import Navbar from "@/features/shared/components/Navbar";
import Hero from "@/features/shared/components/Hero";
import Features from "@/features/shared/components/Features";
import Portfolio from "@/features/shared/components/Portfolio";
import Contact from "@/features/shared/components/Contact";
import Footer from "@/features/shared/components/Footer";
import { StatsIndustries } from "@/features/shared/components/StatsIndustries";
import { BlogSection } from "@/features/blog/components/BlogSection";
import { Team } from "@/features/shared/components/Team";
import { useEffect, useState } from "react";
import { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslation } from "@/features/shared";
import Script from "next/script";

export default function ClientHomePage() {
  const [mounted, setMounted] = useState(false);
  const { locale } = useTranslation();
  const SITE_URL = "https://tarvix.org";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentUrl = locale === "en" ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Tarvix",
    url: currentUrl,
    logo: `${SITE_URL}/logo.png`,
    description:
      locale === "fa"
        ? "تارویکس | استودیوی مهندسی معماری‌محور"
        : locale === "ar"
          ? "تارفيكس | استوديو الهندسة القائم على الهندسة المعمارية"
          : "Tarvix | Architecture-First Engineering Studio",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IR",
    },
    sameAs: [
      "https://github.com/tarvix",
      "https://linkedin.com/company/tarvix",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales",
      availableLanguage: ["English", "Persian", "Arabic"],
    },
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Engineering Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Flutter Development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Software Architecture",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web3 Development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Engineering Consulting",
          },
        },
      ],
    },
  };

  // ============================================
  // BreadcrumbList
  // ============================================
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "fa" ? "خانه" : locale === "ar" ? "الرئيسية" : "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name:
          locale === "fa"
            ? "صفحه اصلی"
            : locale === "ar"
              ? "الصفحة الرئيسية"
              : "Home",
        item: currentUrl,
      },
    ],
  };

  return (
    <>
      <Script
        id="json-ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Script
        id="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="relative">
        <Navbar />
        <Hero />
        <StatsIndustries />
        <Features />
        <Portfolio />
        <BlogSection />
        <Team />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
