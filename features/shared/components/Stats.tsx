"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Lines Analyzed", value: 2300000, suffix: "+", format: true },
  { label: "Active Users", value: 12500, suffix: "+", format: true },
  { label: "Uptime", value: 99.9, suffix: "%", format: false },
  { label: "Vulnerabilities Fixed", value: 8750, suffix: "+", format: true },
];

function Counter({
  target,
  suffix,
  format,
}: {
  target: number;
  suffix: string;
  format: boolean;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, duration / steps);

            return () => clearInterval(timer);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {format ? count.toLocaleString() : count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="py-24 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 px-4 py-1.5 rounded-full border border-[var(--accent-purple)]/10 mb-4">
            Trusted by Startups
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  format={stat.format}
                />
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-2 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
