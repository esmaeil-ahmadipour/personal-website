// import StatCard from "@/features/shared/components/StatCard";

"use client";

import { useEffect, useState } from "react";
import Navbar from "@/features/shared/components/Navbar";
import Hero from "@/features/shared/components/Hero";
import Features from "@/features/shared/components/Features";
import Portfolio from "@/features/shared/components/Portfolio";
import Team from "@/features/shared/components/Team";
import Contact from "@/features/shared/components/Contact";
import Footer from "@/features/shared/components/Footer";
import { StatsIndustries } from "@/features/shared/components/StatsIndustries";
import { BlogSection } from "@/features/blog/components/BlogSection";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
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
  );
}
