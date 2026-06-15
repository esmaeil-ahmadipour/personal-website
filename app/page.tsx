// app/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Theme & Language utilities
const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("tarvix_theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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

// Projects data
const projectsData = [
  {
    title: "Pactus Node Management",
    category: "Blockchain Infrastructure",
    role: "Flutter architecture & GUI lead",
    description: "Official GUI for Pactus blockchain — node management, validator operations, and cross-platform desktop app.",
    technologies: ["Flutter", "gRPC", "Blockchain"],
  },
  {
    title: "Daneshjouyar",
    category: "EdTech Platform",
    role: "Flutter team lead & architecture",
    description: "Student life platform serving 50,000+ users with PWA, Android, and iOS support.",
    technologies: ["Flutter", "Clean Architecture", "BLoC"],
  },
  {
    title: "TON Crypto Payment System",
    category: "Web3 Fintech",
    role: "Backend & smart contract integration",
    description: "Cryptocurrency payment solution on TON network with automated consolidation.",
    technologies: ["Golang", "Smart Contracts", "TON"],
  },
  {
    title: "Admin Panel Microservices",
    category: "Enterprise Backend",
    role: "Backend architecture & implementation",
    description: "Scalable microservices-based admin panel supporting 10,000+ concurrent users.",
    technologies: ["Nest.js", "Docker", "RabbitMQ"],
  },
  {
    title: "Mohsen Grocery Ecosystem",
    category: "Retail Tech",
    role: "Lead Flutter developer",
    description: "Complete grocery management system with warehouse, delivery tracking, and Bluetooth printing.",
    technologies: ["Flutter", "Bluetooth", "Geolocation"],
  },
  {
    title: "Custom Flutter Packages",
    category: "Open Source",
    role: "Package author & maintainer",
    description: "Published packages for Jalali date picker, fast cached images, and utilities.",
    technologies: ["Flutter", "Dart", "Pub.dev"],
  },
];

// Team data
const teamData = [
  {
    name: "Esmaeil Ahmadipour",
    role: "Founder & Flutter Team Lead",
    bio: "8+ years in mobile development. Leads architecture and delivery for enterprise Flutter applications. Open source contributor and Pactus GUI manager.",
    skills: ["Flutter", "Clean Architecture", "CI/CD"],
  },
  {
    name: "Milad",
    role: "Backend & Web3 Engineer",
    bio: "3+ years in microservices and blockchain integration. Specializes in Nest.js, Golang, and smart contract systems.",
    skills: ["Node.js", "Golang", "Web3"],
  },
  {
    name: "Sina Soujeh",
    role: "Lead Product Designer",
    bio: "Product designer creating design systems for enterprise applications. Google UX certified with 10+ admin panel designs.",
    skills: ["Figma", "Design Systems", "UI/UX"],
  },
];

const techStackData = {
  frontend: ["Flutter", "React", "PWA", "WebAssembly"],
  backend: ["Node.js", "Golang", "PostgreSQL", "Redis", "RabbitMQ", "Kafka"],
  infrastructure: ["Docker", "CI/CD", "GitHub Actions", "Kubernetes"],
};

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"en" | "fa">("en");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    setTheme(getInitialTheme());
    setLang(getInitialLang());
    setMounted(true);
  }, []);

  // Apply theme
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

  // Apply language
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
      localStorage.setItem("tarvix_lang", lang);
    }
  }, [lang, mounted]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleLang = () => setLang(lang === "en" ? "fa" : "en");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you. Tarvix will reach out within 24 hours to discuss your project.");
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
          <button className="lang-switch" onClick={toggleLang}>
            {lang === "en" ? "🇬🇧 English" : "🇮🇷 فارسی"}
          </button>
          <button className="theme-switch" onClick={toggleTheme}>
            🌓 Dark/Light
          </button>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Capabilities</a>
          <a href="#portfolio">Work</a>
          <a href="#package">Foundation</a>
          <a href="#about">Team</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home">
        <div className="container">
          <div style={{ maxWidth: 800 }}>
            <h1>Architecture-first product engineering for serious teams.</h1>
            <div className="hero-sub">
              Tarvix builds scalable digital foundations — Flutter, Web3, and smart contract systems with clean architecture and maintainable codebases. For CTOs and founders who need more than just implementation.
            </div>
            <div className="btn-group">
              <a href="#contact" className="btn btn-primary">Start a project →</a>
              <a href="#contact" className="btn btn-outline">Request architecture audit</a>
              <a href="#portfolio" className="btn btn-outline">Explore our work</a>
              <Link href="/dev" className="btn btn-outline">View our Engineering System</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section id="services">
        <div className="container">
          <h2>Engineering capabilities</h2>
          <div className="grid-3">
            <div className="card"><span className="badge">Cross-platform</span><h3>Flutter Development</h3><p>iOS, Android, Web, and desktop from a single codebase with modular architecture and production-grade quality.</p></div>
            <div className="card"><span className="badge">Modern Web</span><h3>Web Application Development</h3><p>React, Vue, and responsive systems with performance optimization and accessibility standards.</p></div>
            <div className="card"><span className="badge">Blockchain</span><h3>Web3 & Smart Contracts</h3><p>dApp frontends, wallet UX, gas abstraction, and secure smart contract integration for crypto products.</p></div>
            <div className="card"><span className="badge">Design Implementation</span><h3>UI/UX Execution</h3><p>Pixel-perfect design system implementation with component-driven development and design-to-code workflows.</p></div>
            <div className="card"><span className="badge">System Architecture</span><h3>Modular System Design</h3><p>Microservices, clean architecture, and scalable foundations that reduce technical debt over time.</p></div>
            <div className="card"><span className="badge">Team Enablement</span><h3>Engineering Consulting</h3><p>Architecture reviews, team training, and technical strategy for organizations scaling their product development.</p></div>
          </div>
        </div>
      </section>

      {/* WHY TARVIX */}
      <section>
        <div className="container">
          <h2>Why engineering teams choose Tarvix</h2>
          <div className="grid-3">
            <div className="card"><h3>🏗️ Architecture-first development</h3><p>We don't start coding blind. Every engagement begins with a technical foundation review and architectural planning.</p></div>
            <div className="card"><h3>🧩 Modular & maintainable systems</h3><p>Clean architecture, enforced patterns, and automated quality gates ensure your codebase stays healthy for years.</p></div>
            <div className="card"><h3>⚡ Scalable product execution</h3><p>From design to deployment — we deliver with structure, speed, and technical integrity. No shortcuts.</p></div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio">
        <div className="container">
          <h2>Selected engineering work</h2>
          <div className="grid-3" id="projectsContainer">
            {projectsData.map((proj, idx) => (
              <div className="card" key={idx}>
                <span className="badge">{proj.category}</span>
                <h3>{proj.title}</h3>
                <p style={{ fontSize: "0.9rem", margin: "0.5rem 0" }}><strong>Tarvix role:</strong> {proj.role}</p>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>{proj.description}</p>
                <div className="tech-grid" style={{ marginTop: "0.5rem" }}>
                  {proj.technologies.map((tech, i) => (
                    <span className="tech-item" key={i}>{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARVIX FOUNDATION */}
      <section id="package" className="bg-subtle">
        <div className="container">
          <h2>Tarvix Engineering Foundation</h2>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem", maxWidth: 700 }}>A productized engineering foundation for teams building large products without unnecessary friction.</p>
          <div className="grid-2">
            <div className="card"><h3>📉 Reduce technical debt</h3><p>Early architecture decisions influence 80% of maintenance costs. We embed boundaries from day zero.</p></div>
            <div className="card"><h3>🏛️ Scalable architecture</h3><p>Domain-driven design, dependency inversion, and modular structure. Scale teams without merge conflicts.</p></div>
            <div className="card"><h3>🔄 Engineering consistency</h3><p>Automated quality gates, architecture tests, and CI/CD pipelines that keep your codebase clean.</p></div>
            <div className="card"><h3>🎯 For serious teams</h3><p>CTOs, product leads, and engineering directors scaling mission-critical products from startup to enterprise.</p></div>
          </div>
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <a href="#contact" className="btn btn-primary">Use Tarvix as your foundation →</a>
            <a href="#contact" className="btn btn-outline" style={{ marginLeft: "1rem" }}>Schedule architecture review</a>
          </div>
        </div>
      </section>

      {/* BLOG INSIGHTS */}
      <section id="blog">
        <div className="container">
          <h2>Engineering insights</h2>
          <div className="grid-3">
            <div className="card"><span className="badge">Architecture</span><h3>Why clean architecture still matters</h3><p>Separating domain from frameworks reduces friction and technical debt in large codebases.</p><a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>Read more →</a></div>
            <div className="card"><span className="badge">Flutter</span><h3>Scaling Flutter with modular design</h3><p>Feature-first modules and generated routes for teams of 10+ engineers.</p><a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>Read more →</a></div>
            <div className="card"><span className="badge">Web3 UX</span><h3>Designing usable crypto products</h3><p>Reducing cognitive load and making smart contracts accessible to mainstream users.</p><a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>Read more →</a></div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="about">
        <div className="container">
          <h2>Engineering leadership</h2>
          <div className="grid-3">
            {teamData.map((member, idx) => (
              <div className="card" key={idx}>
                <div className="avatar-placeholder"><i className="fas fa-user"></i></div>
                <h3>{member.name}</h3>
                <p style={{ color: "var(--accent)", fontWeight: 600, marginBottom: "0.5rem" }}>{member.role}</p>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>{member.bio}</p>
                <div className="tech-grid">
                  {member.skills.map((skill, i) => (
                    <span className="tech-item" key={i}>{skill}</span>
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
          <h2>Technology stack</h2>
          <div className="grid-3">
            <div className="card">
              <h3>Frontend</h3>
              <div className="tech-grid">
                {techStackData.frontend.map((t, i) => (
                  <span className="tech-item" key={i}><i className="fas fa-code"></i> {t}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Backend</h3>
              <div className="tech-grid">
                {techStackData.backend.map((t, i) => (
                  <span className="tech-item" key={i}><i className="fas fa-server"></i> {t}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Infrastructure</h3>
              <div className="tech-grid">
                {techStackData.infrastructure.map((t, i) => (
                  <span className="tech-item" key={i}><i className="fas fa-cloud"></i> {t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <h2>Start a conversation</h2>
          <div className="contact-grid">
            <div>
              <p>Tell us about your product vision or architecture challenge. We'll respond within 24 hours.</p>
              <form id="contactForm" onSubmit={handleContactSubmit}>
                <input type="text" id="nameInput" placeholder="Full name" required />
                <input type="email" id="emailInput" placeholder="Email" required />
                <select id="serviceSelect">
                  <option>Flutter development</option>
                  <option>Web application</option>
                  <option>Web3 / Crypto product</option>
                  <option>Software architecture consulting</option>
                  <option>Tarvix foundation package</option>
                  <option>Architecture audit request</option>
                </select>
                <textarea rows={4} id="msgInput" placeholder="Describe your project or architecture needs..."></textarea>
                <button type="submit" className="btn btn-primary">Send inquiry →</button>
              </form>
              <p style={{ marginTop: "1rem" }}>📧 contact@tarvix.org  ·  <i className="fab fa-github"></i> <i className="fab fa-x"></i> <i className="fab fa-linkedin"></i> <i className="fab fa-telegram"></i></p>
            </div>
            <div className="card">
              <h3>Free architecture audit</h3>
              <p>Not ready to commit? Request a 30-minute technical review of your current architecture or product plan. No obligation. No sales pitch.</p>
              <a href="#" className="btn btn-outline" style={{ marginTop: "1rem", display: "inline-block" }}>Request audit →</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <p>© 2025 Tarvix — architecture-first engineering studio. Good software is engineered, not just coded.</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>Flutter · Web3 · UI/UX · Smart Contracts · Architecture Consulting</p>
        </div>
      </footer>
    </>
  );
}