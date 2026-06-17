// app/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useDirection } from "@/providers/DirectionProvider";
import { useTranslation } from "@/features/shared";

// Theme utilities
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

// Projects data
const projectsData = [
  {
    titleKey: "projectPactusTitle",
    categoryKey: "projectPactusCategory",
    roleKey: "projectPactusRole",
    descriptionKey: "projectPactusDesc",
    technologies: ["Flutter", "gRPC", "Blockchain"],
  },
  {
    titleKey: "projectDaneshjouyarTitle",
    categoryKey: "projectDaneshjouyarCategory",
    roleKey: "projectDaneshjouyarRole",
    descriptionKey: "projectDaneshjouyarDesc",
    technologies: ["Flutter", "Clean Architecture", "BLoC"],
  },
  {
    titleKey: "projectTONTitle",
    categoryKey: "projectTONCategory",
    roleKey: "projectTONRole",
    descriptionKey: "projectTONDesc",
    technologies: ["Golang", "Smart Contracts", "TON"],
  },
  {
    titleKey: "projectAdminTitle",
    categoryKey: "projectAdminCategory",
    roleKey: "projectAdminRole",
    descriptionKey: "projectAdminDesc",
    technologies: ["Nest.js", "Docker", "RabbitMQ"],
  },
  {
    titleKey: "projectMohsenTitle",
    categoryKey: "projectMohsenCategory",
    roleKey: "projectMohsenRole",
    descriptionKey: "projectMohsenDesc",
    technologies: ["Flutter", "Bluetooth", "Geolocation"],
  },
  {
    titleKey: "projectPackagesTitle",
    categoryKey: "projectPackagesCategory",
    roleKey: "projectPackagesRole",
    descriptionKey: "projectPackagesDesc",
    technologies: ["Flutter", "Dart", "Pub.dev"],
  },
];

// Team data
const teamData = [
  {
    name: "Esmaeil Ahmadipour",
    roleKey: "teamEsmaeilRole",
    bioKey: "teamEsmaeilBio",
    skills: ["Flutter", "Clean Architecture", "CI/CD"],
  },
  {
    name: "Milad",
    roleKey: "teamMiladRole",
    bioKey: "teamMiladBio",
    skills: ["Node.js", "Golang", "Web3"],
  },
  {
    name: "Sina Soujeh",
    roleKey: "teamSinaRole",
    bioKey: "teamSinaBio",
    skills: ["Figma", "Design Systems", "UI/UX"],
  },
];

const techStackData = {
  frontend: ["Flutter", "React", "PWA", "WebAssembly"],
  backend: ["Node.js", "Golang", "PostgreSQL", "Redis", "RabbitMQ", "Kafka"],
  infrastructure: ["Docker", "CI/CD", "GitHub Actions", "Kubernetes"],
};

export default function HomePage() {
  const { isRTL, toggleDirection } = useDirection();
  const { t } = useTranslation();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (theme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
      localStorage.setItem("tarvix_theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t("contactSuccess"));
    (e.target as HTMLFormElement).reset();
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Navigation */}
      <nav>
        <div className="logo">TARVIX</div>
        <div className="nav-controls">
          <button className="lang-switch" onClick={toggleDirection}>
            {isRTL ? "🇬🇧 English" : "🇮🇷 فارسی"}
          </button>
          <button className="theme-switch" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
        <div className="nav-links">
          <a href="#home">{t("home")}</a>
          <a href="#services">{t("capabilities")}</a>
          <a href="#portfolio">{t("work")}</a>
          <a href="#package">{t("foundation")}</a>
          <a href="#about">{t("team")}</a>
          <a href="#contact">{t("contact")}</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="home">
        <div className="container">
          <div style={{ maxWidth: 800 }}>
            <h1>{t("heroTitle")}</h1>
            <div className="hero-sub">{t("heroSub")}</div>
            <div className="btn-group">
              <a href="#contact" className="btn btn-primary">
                {t("startProject")} →
              </a>
              <a href="#contact" className="btn btn-outline">
                {t("requestAudit")}
              </a>
              <a href="#portfolio" className="btn btn-outline">
                {t("exploreWork")}
              </a>
              <Link href="/dev" className="btn btn-outline">
                {t("viewEngineeringSystem")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="services">
        <div className="container">
          <h2>{t("capabilitiesTitle")}</h2>
          <div className="grid-3">
            <div className="card">
              <span className="badge">{t("capBadge1")}</span>
              <h3>{t("capTitle1")}</h3>
              <p>{t("capDesc1")}</p>
            </div>
            <div className="card">
              <span className="badge">{t("capBadge2")}</span>
              <h3>{t("capTitle2")}</h3>
              <p>{t("capDesc2")}</p>
            </div>
            <div className="card">
              <span className="badge">{t("capBadge3")}</span>
              <h3>{t("capTitle3")}</h3>
              <p>{t("capDesc3")}</p>
            </div>
            <div className="card">
              <span className="badge">{t("capBadge4")}</span>
              <h3>{t("capTitle4")}</h3>
              <p>{t("capDesc4")}</p>
            </div>
            <div className="card">
              <span className="badge">{t("capBadge5")}</span>
              <h3>{t("capTitle5")}</h3>
              <p>{t("capDesc5")}</p>
            </div>
            <div className="card">
              <span className="badge">{t("capBadge6")}</span>
              <h3>{t("capTitle6")}</h3>
              <p>{t("capDesc6")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TARVIX */}
      <section>
        <div className="container">
          <h2>{t("whyTitle0")}</h2>
          <div className="grid-3">
            <div className="card">
              <h3>🏗️ {t("whyTitle1")}</h3>
              <p>{t("whyDesc1")}</p>
            </div>
            <div className="card">
              <h3>🧩 {t("whyTitle2")}</h3>
              <p>{t("whyDesc2")}</p>
            </div>
            <div className="card">
              <h3>⚡ {t("whyTitle3")}</h3>
              <p>{t("whyDesc3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio">
        <div className="container">
          <h2>{t("portfolioTitle")}</h2>
          <div className="grid-3">
            {projectsData.map((proj, idx) => (
              <div className="card" key={idx}>
                <span className="badge">{t(proj.categoryKey)}</span>
                <h3>{t(proj.titleKey)}</h3>
                <p style={{ fontSize: "0.9rem", margin: "0.5rem 0" }}>
                  <strong>{t("tarvixRole")}:</strong> {t(proj.roleKey)}
                </p>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                  {t(proj.descriptionKey)}
                </p>
                <div className="tech-grid" style={{ marginTop: "0.5rem" }}>
                  {proj.technologies.map((tech, i) => (
                    <span className="tech-item" key={i}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDATION */}
      <section id="package" className="bg-subtle">
        <div className="container">
          <h2>{t("foundationTitle")}</h2>
          <p
            style={{ fontSize: "1.2rem", marginBottom: "2rem", maxWidth: 700 }}
          >
            {t("foundationSub")}
          </p>
          <div className="grid-2">
            <div className="card">
              <h3>📉 {t("foundationTitle1")}</h3>
              <p>{t("foundationDesc1")}</p>
            </div>
            <div className="card">
              <h3>🏛️ {t("foundationTitle2")}</h3>
              <p>{t("foundationDesc2")}</p>
            </div>
            <div className="card">
              <h3>🔄 {t("foundationTitle3")}</h3>
              <p>{t("foundationDesc3")}</p>
            </div>
            <div className="card">
              <h3>🎯 {t("foundationTitle4")}</h3>
              <p>{t("foundationDesc4")}</p>
            </div>
          </div>
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <a href="#contact" className="btn btn-primary">
              {t("useFoundation")} →
            </a>
            <a
              href="#contact"
              className="btn btn-outline"
              style={{ marginInlineStart: "1rem" }}
            >
              {t("scheduleReview")}
            </a>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog">
        <div className="container">
          <h2>{t("blogTitle")}</h2>
          <div className="grid-3">
            <div className="card">
              <span className="badge">{t("blogBadge1")}</span>
              <h3>{t("blogTitle1")}</h3>
              <p>{t("blogDesc1")}</p>
              <a
                href="#"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                {t("readMore")} →
              </a>
            </div>
            <div className="card">
              <span className="badge">{t("blogBadge2")}</span>
              <h3>{t("blogTitle2")}</h3>
              <p>{t("blogDesc2")}</p>
              <a
                href="#"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                {t("readMore")} →
              </a>
            </div>
            <div className="card">
              <span className="badge">{t("blogBadge3")}</span>
              <h3>{t("blogTitle3")}</h3>
              <p>{t("blogDesc3")}</p>
              <a
                href="#"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                {t("readMore")} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="about">
        <div className="container">
          <h2>{t("teamTitle")}</h2>
          <div className="grid-3">
            {teamData.map((member, idx) => (
              <div className="card" key={idx}>
                <div className="avatar-placeholder">
                  <i className="fas fa-user"></i>
                </div>
                <h3>{member.name}</h3>
                <p
                  style={{
                    color: "var(--accent)",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  {t(member.roleKey)}
                </p>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                  {t(member.bioKey)}
                </p>
                <div className="tech-grid">
                  {member.skills.map((skill, i) => (
                    <span className="tech-item" key={i}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="bg-subtle">
        <div className="container">
          <h2>{t("stackTitle")}</h2>
          <div className="grid-3">
            <div className="card">
              <h3>{t("stackFrontend")}</h3>
              <div className="tech-grid">
                {techStackData.frontend.map((t, i) => (
                  <span className="tech-item" key={i}>
                    <i className="fas fa-code"></i> {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>{t("stackBackend")}</h3>
              <div className="tech-grid">
                {techStackData.backend.map((t, i) => (
                  <span className="tech-item" key={i}>
                    <i className="fas fa-server"></i> {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>{t("stackInfra")}</h3>
              <div className="tech-grid">
                {techStackData.infrastructure.map((t, i) => (
                  <span className="tech-item" key={i}>
                    <i className="fas fa-cloud"></i> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <h2>{t("contactTitle")}</h2>
          <div className="contact-grid">
            <div>
              <p>{t("contactDesc")}</p>
              <form onSubmit={handleContactSubmit}>
                <input type="text" placeholder={t("fullName")} required />
                <input type="email" placeholder={t("email")} required />
                <select aria-label={t("serviceSelect")}>
                  <option>{t("serviceFlutter")}</option>
                  <option>{t("serviceWeb")}</option>
                  <option>{t("serviceWeb3")}</option>
                  <option>{t("serviceConsulting")}</option>
                  <option>{t("serviceFoundation")}</option>
                  <option>{t("serviceAudit")}</option>
                </select>
                <textarea rows={4} placeholder={t("projectDesc")}></textarea>
                <button type="submit" className="btn btn-primary">
                  {t("sendInquiry")} →
                </button>
              </form>
              <p style={{ marginTop: "1rem" }}>
                📧 contact@tarvix.org · <i className="fab fa-github"></i>{" "}
                <i className="fab fa-x"></i> <i className="fab fa-linkedin"></i>{" "}
                <i className="fab fa-telegram"></i>
              </p>
            </div>
            <div className="card">
              <h3>{t("auditTitle")}</h3>
              <p>{t("auditDesc")}</p>
              <a
                href="#"
                className="btn btn-outline"
                style={{ marginTop: "1rem", display: "inline-block" }}
              >
                {t("auditCTA")} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <p>{t("footer")}</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
            {t("footerTags")}
          </p>
        </div>
      </footer>
    </>
  );
}
