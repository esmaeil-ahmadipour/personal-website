// app/dev/page.tsx
"use client";

import { Breadcrumb } from "@/features/early-access/components/Breadcrumb";
import Link from "next/link";
import { useState, useEffect } from "react";

const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("tarvix_theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

const getInitialLang = (): "en" | "fa" => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("tarvix_lang");
    if (saved === "en" || saved === "fa") return saved;
  }
  return "en";
};

export default function DevPlatformPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"en" | "fa">("en");
  const [mounted, setMounted] = useState(false);
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    fullName: "",
    workEmail: "",
    roleTitle: "",
    companyTeam: "",
    ghUsername: "",
    prefStack: "flutter",
    whyAccess: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [ghError, setGhError] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setLang(getInitialLang());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (theme === "dark") document.body.classList.add("dark");
      else document.body.classList.remove("dark");
      localStorage.setItem("tarvix_theme", theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
      localStorage.setItem("tarvix_lang", lang);
    }
  }, [lang, mounted]);

  useEffect(() => {
    if (!isHeroDialogOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsHeroDialogOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isHeroDialogOpen]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleLang = () => setLang(lang === "en" ? "fa" : "en");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
    if (id === "ghUsername") {
      const ghRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
      setGhError(!ghRegex.test(value) && value.length > 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formState.fullName.trim()) {
      setValidationError("Full name is required");
      return;
    }
    if (
      !formState.workEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.workEmail)
    ) {
      setValidationError("Valid email is required");
      return;
    }
    if (!formState.ghUsername.trim()) {
      setValidationError("GitHub username is required");
      return;
    }
    const ghRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!ghRegex.test(formState.ghUsername)) {
      setValidationError("Invalid GitHub username format");
      setGhError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formState.fullName,
          email: formState.workEmail,
          role: formState.roleTitle || undefined,
          company: formState.companyTeam || undefined,
          githubUsername: formState.ghUsername,
          preferredStack: formState.prefStack,
          message: formState.whyAccess || undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
      } else {
        setValidationError(
          data.message || "Something went wrong. Please try again.",
        );
      }
    } catch {
      setValidationError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormState({
      fullName: "",
      workEmail: "",
      roleTitle: "",
      companyTeam: "",
      ghUsername: "",
      prefStack: "flutter",
      whyAccess: "",
    });
    setSubmitSuccess(false);
    setValidationError(null);
    setGhError(false);
  };

  const closeDialog = () => {
    setIsHeroDialogOpen(false);
    resetForm();
  };

  if (!mounted) return null;

  return (
    <>
      <nav className="flex items-center flex-nowrap w-full">
        <div className="logo text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 whitespace-nowrap">
          TARVIX
        </div>
        <Breadcrumb />
        <div className="nav-controls flex items-center gap-2 ml-auto">
          <button className="lang-switch" onClick={toggleLang}>
            {lang === "en" ? "🇬🇧 English" : "🇮🇷 فارسی"}
          </button>

          <button className="theme-switch" onClick={toggleTheme}>
            🌓 Dark/Light
          </button>
        </div>
        {/* 3. Far Right Group: Links */}
        <div className="nav-links flex items-center gap-4 ml-4">
          <a href="#hero">Platform</a>
          <a href="#substance">System</a>
          <a href="#value-loop">Value Loop</a>
          <a href="#layers">Layers</a>
          <a href="#access">Access</a>
        </div>
      </nav>

      <section id="hero">
        <div className="container">
          <div style={{ maxWidth: 800 }}>
            <h1>
              The Tarvix Developer Platform
              <br />— production systems engineering, shared.
            </h1>

            <div className="hero-sub">
              A codified engineering system for Flutter, Web, and Web3. Built to
              resolve active constraints across high-stakes domains —
              documented, tooled, and ready for adoption.
            </div>

            <div
              className="intent-note"
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary-light)",
                borderLeft: "3px solid var(--accent)",
                paddingLeft: "1rem",
                marginTop: "1.5rem",
              }}
            >
              <i
                className="fas fa-check-circle"
                style={{ marginRight: "0.5rem", color: "var(--accent)" }}
              ></i>
              Patterns tested by reality. Shared because good architecture
              should not stay locked inside agencies.
            </div>

            <div
              className="btn-group"
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  resetForm();
                  setIsHeroDialogOpen(true);
                }}
              >
                Request Early Access →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>Why this system exists</h2>

          <div className="grid-2">
            <div className="card">
              <span className="badge">Repeated production constraints</span>

              <p style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>
                Every serious product faces the same challenges: unclear
                boundaries, inconsistent standards, and accumulating debt. This
                system codifies what we learned solving those problems across
                fintech, Web3, logistics, and ed-tech.
              </p>
            </div>

            <div className="card">
              <span className="badge">Shared engineering leverage</span>

              <p style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>
                When architecture decisions are documented and enforced, teams
                stop debating the same questions. When quality is automated,
                human energy goes to product value, not firefighting.
              </p>
            </div>
          </div>

          <p
            style={{
              marginTop: "2rem",
              fontSize: "1rem",
              color: "var(--text-secondary-light)",
            }}
          >
            The platform gives you visibility into how we build. The system
            provides patterns you can adapt. A shared foundation grounded in
            engineering reality.
          </p>
        </div>
      </section>

      <section id="substance">
        <div className="container">
          <h2>
            The Tarvix Engineering System
            <br />
            <span
              style={{
                fontSize: "1.2rem",
                color: "var(--text-secondary-light)",
              }}
            >
              — decisions, not decoration
            </span>
          </h2>

          <div className="grid-2">
            <div className="card">
              <p>
                A living body of architectural decisions, quality standards,
                automation patterns, and reference implementations. Every piece
                here was designed to resolve active structural friction — across
                fintech, blockchain, logistics, and ed-tech.
              </p>
            </div>

            <div className="card">
              <p>
                Selected parts are available through the Developer Platform: as
                open patterns, documented standards, and reference
                implementations. Designed to provide immediate engineering
                leverage.
              </p>
            </div>
          </div>

          <div
            className="card"
            style={{
              marginTop: "1.5rem",
              background: "rgba(59, 130, 246, 0.05)",
            }}
          >
            <p style={{ fontSize: "1.1rem", fontWeight: 500 }}>
              One organizing principle: <strong>engineering leverage</strong>.
              Every decision exists to make future work faster, safer, and more
              predictable.
            </p>
          </div>
        </div>
      </section>

      <section id="value-loop">
        <div className="container">
          <h2>The system flywheel</h2>

          <p
            style={{
              marginBottom: "2rem",
              fontSize: "1rem",
              color: "var(--text-secondary-light)",
            }}
          >
            Each cycle increases leverage for everyone who comes next.
          </p>

          <div
            className="flywheel-visual"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              margin: "2rem 0",
              flexWrap: "wrap",
            }}
          >
            <div
              className="flywheel-step card"
              style={{ flex: 1, textAlign: "center", padding: "1rem" }}
            >
              <i
                className="fas fa-users"
                style={{
                  fontSize: "2rem",
                  color: "var(--accent)",
                  marginBottom: "0.5rem",
                  display: "inline-block",
                }}
              ></i>

              <h3 style={{ fontSize: "1.1rem" }}>Adopt</h3>

              <p style={{ fontSize: "0.9rem" }}>
                Teams integrate patterns into their codebases
              </p>
            </div>

            <div
              className="flywheel-arrow"
              style={{ fontSize: "1.5rem", color: "var(--accent)" }}
            >
              <i className="fas fa-arrow-right"></i>
            </div>

            <div
              className="flywheel-step card"
              style={{ flex: 1, textAlign: "center", padding: "1rem" }}
            >
              <i
                className="fas fa-flask"
                style={{
                  fontSize: "2rem",
                  color: "var(--accent)",
                  marginBottom: "0.5rem",
                  display: "inline-block",
                }}
              ></i>

              <h3 style={{ fontSize: "1.1rem" }}>Validate</h3>

              <p style={{ fontSize: "0.9rem" }}>
                Active deployment reveals what holds up
              </p>
            </div>

            <div
              className="flywheel-arrow"
              style={{ fontSize: "1.5rem", color: "var(--accent)" }}
            >
              <i className="fas fa-arrow-right"></i>
            </div>

            <div
              className="flywheel-step card"
              style={{ flex: 1, textAlign: "center", padding: "1rem" }}
            >
              <i
                className="fas fa-sync-alt"
                style={{
                  fontSize: "2rem",
                  color: "var(--accent)",
                  marginBottom: "0.5rem",
                  display: "inline-block",
                }}
              ></i>

              <h3 style={{ fontSize: "1.1rem" }}>Refine</h3>

              <p style={{ fontSize: "0.9rem" }}>
                Improvements return to documentation and tooling
              </p>
            </div>

            <div
              className="flywheel-arrow"
              style={{ fontSize: "1.5rem", color: "var(--accent)" }}
            >
              <i className="fas fa-arrow-right"></i>
            </div>

            <div
              className="flywheel-step card"
              style={{ flex: 1, textAlign: "center", padding: "1rem" }}
            >
              <i
                className="fas fa-chart-line"
                style={{
                  fontSize: "2rem",
                  color: "var(--accent)",
                  marginBottom: "0.5rem",
                  display: "inline-block",
                }}
              ></i>

              <h3 style={{ fontSize: "1.1rem" }}>Reapply</h3>

              <p style={{ fontSize: "0.9rem" }}>
                Refined patterns become the baseline for the next cycle
              </p>
            </div>
          </div>

          <div className="grid-3" style={{ marginTop: "2rem" }}>
            <div className="card value-card">
              <h3>Individual developer</h3>

              <p>
                <strong>Leverage that compounds.</strong> Clear patterns reduce
                cognitive load. Documented decisions eliminate guesswork. Each
                cycle makes the system more robust — and you benefit without
                reinvention.
              </p>
            </div>

            <div className="card value-card">
              <h3>Team / company</h3>

              <p>
                <strong>Lower coordination costs over time.</strong> Shared
                vocabulary across projects. Reduced architectural drift. New
                members onboard faster because patterns are consistent — not
                because of hidden tribal knowledge.
              </p>
            </div>

            <div className="card value-card">
              <h3>Engineering ecosystem</h3>

              <p>
                <strong>Better defaults for everyone.</strong> Open
                documentation raises the industry baseline. Reference
                implementations become teaching tools. Quality spreads because
                functional design outlasts transient trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="layers"
        className="py-20 border-b border-gray-200 dark:border-gray-800"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            System layers — engineering philosophy
          </h2>

          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            Each layer represents a commitment to quality, not a checklist of
            tools.
          </p>

          <div className="flex flex-col">
            {[
              {
                title: "Layer 1 — Modular Domain Boundaries",
                content:
                  "Feature-first organization. Clean separation between domain logic, data access, and presentation. Dependency direction flows inward. Changes localize — cross-module impact is explicit and reviewed.",
              },
              {
                title: "Layer 2 — Living Documentation Standards",
                content:
                  "Architectural Decision Records (ADRs) as first-class citizens. Coding conventions that prioritize readability over cleverness. Design system implementation guidelines that bridge design and code without translation gaps.",
              },
              {
                title: "Layer 3 — Automated Quality Gates",
                content:
                  "Continuous integration that enforces architecture rules before merge. Dependency graphs that prevent circular imports. Coverage thresholds that fail builds, not just report. No human approval overrides automated gates.",
              },
              {
                title: "Layer 4 — Reference Implementations",
                content:
                  "Applied reference setups that clarify architectural decisions and accelerate adoption. Each demonstrates how structural principles behave in implementation, reducing ambiguity and providing a rigorous starting point for engineering teams.",
                footer:
                  "Flutter production reference · Web3 integration example · Backend service blueprint · Design system implementation",
              },
            ].map((layer, idx, arr) => (
              <div
                key={idx}
                className="card p-6 border-l-[3px] border-l-blue-500 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                style={{ marginBottom: idx !== arr.length - 1 ? "1.0rem" : 0 }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {layer.title}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {layer.content}
                </p>

                {layer.footer && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {layer.footer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>Operating principles</h2>

          <div className="grid-3">
            <div className="card">
              <span className="badge">Readability</span>

              <h3>Clarity over cleverness</h3>

              <p>
                Code is read far more often than it's written. Patterns that
                surprise are patterns that fail. We optimize for comprehension,
                not conciseness.
              </p>
            </div>

            <div className="card">
              <span className="badge">Explicit standards</span>

              <h3>Standards over tribal knowledge</h3>

              <p>
                If it's not documented and enforced, it doesn't exist. We prefer
                explicit rules that computers can check over unwritten
                agreements that humans must remember.
              </p>
            </div>

            <div className="card">
              <span className="badge">Reusable precedent</span>

              <h3>Reusable decisions over repeated debate</h3>

              <p>
                Every architecture question worth asking once is worth
                documenting as a precedent. We invest in decisions that compound
                across teams and projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="access">
        <div className="container">
          <h2>Explore the Engineering System</h2>

          <div className="grid-3">
            <div className="card" style={{ textAlign: "center" }}>
              <i
                className="fas fa-book"
                style={{
                  fontSize: "2rem",
                  color: "var(--accent)",
                  marginBottom: "1rem",
                  display: "inline-block",
                }}
              ></i>

              <h3>Architecture Guide</h3>

              <p>
                Understand the foundation. Documentation detailing modular
                boundaries, layer decisions, and the rationale behind each
                pattern.
              </p>

              <a
                href="#"
                className="btn-subtle"
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  background: "transparent",
                  color: "var(--accent)",
                  padding: "0.5rem 1rem",
                }}
              >
                Read documentation →
              </a>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <i
                className="fab fa-github"
                style={{
                  fontSize: "2rem",
                  color: "var(--accent)",
                  marginBottom: "1rem",
                  display: "inline-block",
                }}
              ></i>

              <h3>Reference Implementations</h3>

              <p>
                Inspect the implementation. Functional, forkable repositories
                demonstrating how structural decisions behave in applied
                environments.
              </p>

              <a
                href="#"
                className="btn-subtle"
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  background: "transparent",
                  color: "var(--accent)",
                  padding: "0.5rem 1rem",
                }}
              >
                Explore on GitHub →
              </a>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <i
                className="fas fa-microphone-alt"
                style={{
                  fontSize: "2rem",
                  color: "var(--accent)",
                  marginBottom: "1rem",
                  display: "inline-block",
                }}
              ></i>

              <h3>Architecture Review</h3>

              <p>
                Engage for deeper alignment. A structured engineering review to
                help teams adapt these standards directly to their codebases.
              </p>
            </div>
          </div>

          <div
            className="intent-note"
            style={{
              marginTop: "2rem",
              textAlign: "center",
              fontSize: "0.9rem",
              color: "var(--text-secondary-light)",
              borderLeft: "3px solid var(--accent)",
              paddingLeft: "1rem",
            }}
          >
            <i
              className="fas fa-quote-left"
              style={{ marginRight: "0.5rem" }}
            ></i>
            The platform provides visibility into how robust systems are
            structured, giving teams the blueprints needed to establish their
            own durable engineering standards.
          </div>
        </div>
      </section>

      <section style={{ borderBottom: "none" }}>
        <div className="container">
          <div
            className="card"
            style={{
              textAlign: "center",
              background: "rgba(59, 130, 246, 0.03)",
            }}
          >
            <p style={{ fontSize: "1.1rem", fontWeight: 500 }}>
              Engineering systems only matter when rigor is preserved.
            </p>

            <p style={{ marginTop: "0.5rem" }}>
              This foundation exists to document decisions, enforce
              architectural constraints, and cultivate a durable engineering
              culture.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>
            © 2025 Tarvix — engineering system for digital products. Grounded in
            rigorous constraints across fintech, Web3, and SaaS.
          </p>

          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
            Modular Architecture · Living Standards · Quality Gates · Reference
            Implementations
          </p>
        </div>
      </footer>

      {/* ===== DIALOG ===== */}
      {isHeroDialogOpen && (
        <div
          role="presentation"
          onClick={closeDialog}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-dialog-title"
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "1.5rem",
              background: theme === "dark" ? "#141a22" : "#ffffff",
              color: theme === "dark" ? "#eef2f5" : "#111827",
              padding: "2rem",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.4)",
              border:
                theme === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Header */}
            <div className="modal-header" style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h2
                    id="hero-dialog-title"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                      color: theme === "dark" ? "#ffffff" : "#111827",
                    }}
                  >
                    Request Early Access
                  </h2>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                      lineHeight: 1.6,
                    }}
                  >
                    Request access to the Tarvix Engineering System. Share your
                    GitHub, technical context, and adoption or collaboration
                    goals. Requests are reviewed manually and selected
                    participants may be invited to repository discussions and
                    early collaboration.
                  </p>
                </div>
                <button
                  onClick={closeDialog}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.8rem",
                    cursor: "pointer",
                    color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                    padding: "0 0.5rem",
                    lineHeight: 1,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color =
                      theme === "dark" ? "#ffffff" : "#111827")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      theme === "dark" ? "#b0c0ca" : "#4a5b5e")
                  }
                >
                  ×
                </button>
              </div>
            </div>

            {/* Form */}
            {!submitSuccess ? (
              <form onSubmit={handleSubmit} noValidate>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      htmlFor="fullName"
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={formState.fullName}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.6rem 1rem",
                        border: `1px solid ${
                          theme === "dark" ? "#2a353f" : "#eef2f0"
                        }`,
                        borderRadius: "8px",
                        background: "transparent",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                        fontSize: "0.95rem",
                        transition: "border-color 0.2s",
                        outline: "none",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#3b82f6")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          theme === "dark" ? "#2a353f" : "#eef2f0")
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="workEmail"
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                      }}
                    >
                      Work Email
                    </label>
                    <input
                      id="workEmail"
                      type="email"
                      value={formState.workEmail}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.6rem 1rem",
                        border: `1px solid ${
                          theme === "dark" ? "#2a353f" : "#eef2f0"
                        }`,
                        borderRadius: "8px",
                        background: "transparent",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                        fontSize: "0.95rem",
                        transition: "border-color 0.2s",
                        outline: "none",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#3b82f6")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          theme === "dark" ? "#2a353f" : "#eef2f0")
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="roleTitle"
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                      }}
                    >
                      Role / Title
                    </label>
                    <input
                      id="roleTitle"
                      type="text"
                      value={formState.roleTitle}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.6rem 1rem",
                        border: `1px solid ${
                          theme === "dark" ? "#2a353f" : "#eef2f0"
                        }`,
                        borderRadius: "8px",
                        background: "transparent",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                        fontSize: "0.95rem",
                        transition: "border-color 0.2s",
                        outline: "none",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#3b82f6")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          theme === "dark" ? "#2a353f" : "#eef2f0")
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="companyTeam"
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                      }}
                    >
                      Company or Team
                    </label>
                    <input
                      id="companyTeam"
                      type="text"
                      value={formState.companyTeam}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.6rem 1rem",
                        border: `1px solid ${
                          theme === "dark" ? "#2a353f" : "#eef2f0"
                        }`,
                        borderRadius: "8px",
                        background: "transparent",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                        fontSize: "0.95rem",
                        transition: "border-color 0.2s",
                        outline: "none",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#3b82f6")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          theme === "dark" ? "#2a353f" : "#eef2f0")
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ghUsername"
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                      }}
                    >
                      GitHub Username
                    </label>
                    <input
                      id="ghUsername"
                      type="text"
                      value={formState.ghUsername}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.6rem 1rem",
                        border: `1px solid ${
                          ghError
                            ? "#ef4444"
                            : theme === "dark"
                              ? "#2a353f"
                              : "#eef2f0"
                        }`,
                        borderRadius: "8px",
                        background: "transparent",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                        fontSize: "0.95rem",
                        transition: "border-color 0.2s",
                        outline: "none",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#3b82f6")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = ghError
                          ? "#ef4444"
                          : theme === "dark"
                            ? "#2a353f"
                            : "#eef2f0")
                      }
                      required
                    />
                    {ghError && (
                      <p
                        style={{
                          color: "#ef4444",
                          fontSize: "0.8rem",
                          marginTop: "0.4rem",
                        }}
                      >
                        Invalid GitHub username format
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                        marginTop: "0.4rem",
                      }}
                    >
                      Please provide a valid GitHub username.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="prefStack"
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                      }}
                    >
                      Preferred Stack
                    </label>
                    <select
                      id="prefStack"
                      value={formState.prefStack}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.6rem 1rem",
                        border: `1px solid ${
                          theme === "dark" ? "#2a353f" : "#eef2f0"
                        }`,
                        borderRadius: "8px",
                        background: theme === "dark" ? "#141a22" : "#ffffff",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                        fontSize: "0.95rem",
                        transition: "border-color 0.2s",
                        outline: "none",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#3b82f6")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          theme === "dark" ? "#2a353f" : "#eef2f0")
                      }
                    >
                      <option value="flutter">Flutter (available now)</option>
                      <option value="react">React (interest only)</option>
                      <option value="django">Django (interest only)</option>
                      <option value="nestjs">NestJS (interest only)</option>
                    </select>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                        marginTop: "0.4rem",
                      }}
                    >
                      Flutter CleanArc (Bloc/Riverpod) is supported in the
                      current release. Other stacks are in the
                      interest‑gathering phase.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="whyAccess"
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                      }}
                    >
                      Why do you want access?
                    </label>
                    <textarea
                      id="whyAccess"
                      rows={3}
                      value={formState.whyAccess}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.6rem 1rem",
                        border: `1px solid ${
                          theme === "dark" ? "#2a353f" : "#eef2f0"
                        }`,
                        borderRadius: "8px",
                        background: "transparent",
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                        fontSize: "0.95rem",
                        transition: "border-color 0.2s",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#3b82f6")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          theme === "dark" ? "#2a353f" : "#eef2f0")
                      }
                    />
                  </div>

                  {validationError && (
                    <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>
                      {validationError}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginTop: "1.5rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      onClick={closeDialog}
                      style={{
                        padding: "0.6rem 1.4rem",
                        borderRadius: "40px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "0.2s",
                        fontFamily: "inherit",
                        fontSize: "0.95rem",
                        background: "transparent",
                        border: `1px solid ${
                          theme === "dark" ? "#2a353f" : "#eef2f0"
                        }`,
                        color: theme === "dark" ? "#eef2f5" : "#111827",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          theme === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: "0.6rem 1.4rem",
                        borderRadius: "40px",
                        fontWeight: 600,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        transition: "0.2s",
                        fontFamily: "inherit",
                        fontSize: "0.95rem",
                        background: "#3b82f6",
                        color: "white",
                        border: "1px solid #3b82f6",
                        opacity: isSubmitting ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting)
                          e.currentTarget.style.background = "#2563eb";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting)
                          e.currentTarget.style.background = "#3b82f6";
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Request Access"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Success State */
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <i
                  className="fas fa-check-circle"
                  style={{
                    fontSize: "3rem",
                    color: "#3b82f6",
                    marginBottom: "1rem",
                    display: "inline-block",
                  }}
                ></i>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: theme === "dark" ? "#ffffff" : "#111827",
                  }}
                >
                  Request Received
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                    marginBottom: "0.5rem",
                  }}
                >
                  Thanks — your request has been received.
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                    marginBottom: "1.5rem",
                  }}
                >
                  We will review it and contact you if your access is approved.
                </p>
                <button
                  onClick={closeDialog}
                  style={{
                    padding: "0.6rem 1.4rem",
                    borderRadius: "40px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "0.2s",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                    background: "transparent",
                    border: `1px solid ${
                      theme === "dark" ? "#2a353f" : "#eef2f0"
                    }`,
                    color: theme === "dark" ? "#eef2f5" : "#111827",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      theme === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
