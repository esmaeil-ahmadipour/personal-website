// app/dev/page.tsx
"use client";

import { Breadcrumb } from "@/features/early-access/components/Breadcrumb";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { useDirection } from "@/providers/DirectionProvider";
import Link from "next/link";
import React, { useState, useEffect } from "react";

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

export default function DevPlatformPage() {
  const { isRTL, toggleDirection } = useDirection();
  const { t } = useTranslation();

  const [theme, setTheme] = useState<"light" | "dark">("light");
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
      setValidationError(t("fullNameRequired"));
      return;
    }
    if (
      !formState.workEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.workEmail)
    ) {
      setValidationError(t("validEmailRequired"));
      return;
    }
    if (!formState.ghUsername.trim()) {
      setValidationError(t("githubRequired"));
      return;
    }
    const ghRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!ghRegex.test(formState.ghUsername)) {
      setValidationError(t("invalidGithubFormat"));
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
        setValidationError(data.message || t("somethingWentWrong"));
      }
    } catch {
      setValidationError(t("networkError"));
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

  const LanguageButton = () => (
    <button
      className="lang-switch px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      onClick={toggleDirection}
    >
      {isRTL ? "🇬🇧 English" : "🇮🇷 فارسی"}
    </button>
  );

  return (
    <>
      <nav className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="logo text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 whitespace-nowrap">
            TARVIX
          </div>
          <Breadcrumb />
        </div>

        <div className="nav-controls flex items-center gap-2">
          <LanguageButton />
          <button className="theme-switch" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="nav-links flex items-center gap-4 flex-wrap">
          <a href="#hero">{t("platform")}</a>
          <a href="#substance">{t("system")}</a>
          <a href="#value-loop">{t("valueLoop")}</a>
          <a href="#layers">{t("layers")}</a>
          <a href="#access">{t("access")}</a>
        </div>
      </nav>

      <section id="hero">
        <div className="container">
          <div style={{ maxWidth: 800 }}>
            <h1>{t("heroTitleDev")}</h1>

            <div className="hero-sub">{t("heroSubDev")}</div>

            <div
              className="intent-note"
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary-light)",
                borderInlineStart: "3px solid var(--accent)",
                paddingInlineStart: "1rem",
                marginTop: "1.5rem",
              }}
            >
              <i
                className="fas fa-check-circle"
                style={{ marginInlineEnd: "0.5rem", color: "var(--accent)" }}
              ></i>
              {t("heroIntent")}
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
                {t("requestAccess")} →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>{t("whyTitle")}</h2>

          <div className="grid-2">
            <div className="card">
              <span className="badge">{t("whyBadge1")}</span>
              <p style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>
                {t("whyText1")}
              </p>
            </div>

            <div className="card">
              <span className="badge">{t("whyBadge2")}</span>
              <p style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>
                {t("whyText2")}
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
            {t("whyFooter")}
          </p>
        </div>
      </section>

      <section id="substance">
        <div className="container">
          <h2>
            {t("substanceTitle")}
            <br />
            <span
              style={{
                fontSize: "1.2rem",
                color: "var(--text-secondary-light)",
              }}
            >
              {t("substanceSub")}
            </span>
          </h2>

          <div className="grid-2">
            <div className="card">
              <p>{t("substanceText1")}</p>
            </div>

            <div className="card">
              <p>{t("substanceText2")}</p>
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
              {t("substancePrinciple")}
            </p>
          </div>
        </div>
      </section>

      <section id="value-loop">
        <div className="container">
          <h2>{t("flywheelTitle")}</h2>

          <p
            style={{
              marginBottom: "2rem",
              fontSize: "1rem",
              color: "var(--text-secondary-light)",
            }}
          >
            {t("flywheelSub")}
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
            {[
              {
                icon: "users",
                label: t("flywheelAdopt"),
                desc: t("flywheelAdoptDesc"),
              },
              {
                icon: "flask",
                label: t("flywheelValidate"),
                desc: t("flywheelValidateDesc"),
              },
              {
                icon: "sync-alt",
                label: t("flywheelRefine"),
                desc: t("flywheelRefineDesc"),
              },
              {
                icon: "chart-line",
                label: t("flywheelReapply"),
                desc: t("flywheelReapplyDesc"),
              },
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div
                  className="flywheel-step card"
                  style={{ flex: 1, textAlign: "center", padding: "1rem" }}
                >
                  <i
                    className={`fas fa-${step.icon}`}
                    style={{
                      fontSize: "2rem",
                      color: "var(--accent)",
                      marginBottom: "0.5rem",
                      display: "inline-block",
                    }}
                  ></i>
                  <h3 style={{ fontSize: "1.1rem" }}>{step.label}</h3>
                  <p style={{ fontSize: "0.9rem" }}>{step.desc}</p>
                </div>
                {idx < arr.length - 1 && (
                  <div
                    className="flywheel-arrow"
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--accent)",
                      transform: isRTL ? "rotate(180deg)" : "none",
                    }}
                  >
                    <i className="fas fa-arrow-right"></i>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid-3" style={{ marginTop: "2rem" }}>
            <div className="card value-card">
              <h3>{t("valueIndividual")}</h3>
              <p>{t("valueIndividualText")}</p>
            </div>

            <div className="card value-card">
              <h3>{t("valueTeam")}</h3>
              <p>{t("valueTeamText")}</p>
            </div>

            <div className="card value-card">
              <h3>{t("valueEcosystem")}</h3>
              <p>{t("valueEcosystemText")}</p>
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
            {t("layersTitle")}
          </h2>

          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            {t("layersSub")}
          </p>

          <div className="flex flex-col">
            {[
              { title: t("layer1"), content: t("layer1Text") },
              { title: t("layer2"), content: t("layer2Text") },
              { title: t("layer3"), content: t("layer3Text") },
              {
                title: t("layer4"),
                content: t("layer4Text"),
                footer: t("layer4Footer"),
              },
            ].map((layer, idx, arr) => (
              <div
                key={idx}
                className="card p-6 border-l-[3px] border-l-blue-500 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                style={{
                  marginBottom: idx !== arr.length - 1 ? "1.0rem" : 0,
                  borderInlineStart: "3px solid #3b82f6",
                }}
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
          <h2>{t("principlesTitle")}</h2>

          <div className="grid-3">
            <div className="card">
              <span className="badge">{t("principle1Badge")}</span>
              <h3>{t("principle1Title")}</h3>
              <p>{t("principle1Text")}</p>
            </div>

            <div className="card">
              <span className="badge">{t("principle2Badge")}</span>
              <h3>{t("principle2Title")}</h3>
              <p>{t("principle2Text")}</p>
            </div>

            <div className="card">
              <span className="badge">{t("principle3Badge")}</span>
              <h3>{t("principle3Title")}</h3>
              <p>{t("principle3Text")}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="access">
        <div className="container">
          <h2>{t("accessTitle")}</h2>

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
              <h3>{t("accessGuide")}</h3>
              <p>{t("accessGuideText")}</p>
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
                {t("accessGuideLink")}
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
              <h3>{t("accessGithub")}</h3>
              <p>{t("accessGithubText")}</p>
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
                {t("accessGithubLink")}
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
              <h3>{t("accessReview")}</h3>
              <p>{t("accessReviewText")}</p>
            </div>
          </div>

          <div
            className="intent-note"
            style={{
              marginTop: "2rem",
              textAlign: "center",
              fontSize: "0.9rem",
              color: "var(--text-secondary-light)",
              borderInlineStart: "3px solid var(--accent)",
              paddingInlineStart: "1rem",
            }}
          >
            <i
              className="fas fa-quote-left"
              style={{ marginInlineEnd: "0.5rem" }}
            ></i>
            {t("accessFooter")}
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
              {t("finalTitle")}
            </p>
            <p style={{ marginTop: "0.5rem" }}>{t("finalText")}</p>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>{t("footer")}</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
            {t("footerTags")}
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
                    {t("dialogTitle")}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                      lineHeight: 1.6,
                    }}
                  >
                    {t("dialogDesc")}
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
                      {t("fullName")}
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
                      {t("workEmail")}
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
                      {t("roleTitle")}
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
                      {t("companyTeam")}
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
                      {t("githubUsername")}
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
                        {t("invalidGithubFormat")}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                        marginTop: "0.4rem",
                      }}
                    >
                      {t("githubHelp")}
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
                      {t("preferredStack")}
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
                      <option value="flutter">{t("stackFlutter")}</option>
                      <option value="react">{t("stackReact")}</option>
                      <option value="django">{t("stackDjango")}</option>
                      <option value="nestjs">{t("stackNestJS")}</option>
                    </select>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                        marginTop: "0.4rem",
                      }}
                    >
                      {t("stackHelp")}
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
                      {t("whyAccess")}
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
                      {t("cancel")}
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
                      {isSubmitting ? t("submitting") : t("requestAccess")}
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
                  {t("requestReceived")}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                    marginBottom: "0.5rem",
                  }}
                >
                  {t("requestReceivedText1")}
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: theme === "dark" ? "#b0c0ca" : "#4a5b5e",
                    marginBottom: "1.5rem",
                  }}
                >
                  {t("requestReceivedText2")}
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
                  {t("close")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
