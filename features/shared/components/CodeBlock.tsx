"use client";

import { useState } from "react";

export interface Issue {
  line: number;
  severity: "critical" | "high" | "medium" | "low" | "none";
  message: string;
}

interface CodeBlockProps {
  code: string;
  issues: Issue[];
  language?: string;
}

export default function CodeBlock({
  code,
  issues,
  language = "typescript",
}: CodeBlockProps) {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const lines = code.split("\n");

  const getLineSeverity = (lineNumber: number): Issue["severity"] => {
    const issue = issues.find((i) => i.line === lineNumber);
    return issue?.severity || "none";
  };

  const getLineClass = (severity: Issue["severity"]) => {
    const map: Record<Issue["severity"], string> = {
      critical: "line-critical",
      high: "line-high",
      medium: "line-medium",
      low: "",
      none: "",
    };
    return map[severity] || "";
  };

  const getSeverityLabel = (severity: Issue["severity"]) => {
    const map: Record<Issue["severity"], string> = {
      critical: "🔴 CRITICAL",
      high: "🟠 HIGH",
      medium: "🟡 MEDIUM",
      low: "🔵 LOW",
      none: "",
    };
    return map[severity] || "";
  };

  const getIssueForLine = (lineNumber: number) => {
    return issues.find((i) => i.line === lineNumber);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        <pre className="font-mono text-[13px] leading-[1.7] p-4">
          <code>
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const severity = getLineSeverity(lineNumber);
              const issue = getIssueForLine(lineNumber);
              const isHighlighted = severity !== "none";

              return (
                <div
                  key={lineNumber}
                  className={`
                    group relative flex items-start gap-4 
                    px-3 py-0.5 rounded transition-colors
                    hover:bg-[var(--bg-surface)]/50
                    ${isHighlighted ? getLineClass(severity) : ""}
                  `}
                >
                  <span className="text-[var(--text-muted)] text-[11px] font-mono min-w-[2.5rem] select-none text-right">
                    {lineNumber}
                  </span>
                  <span className="flex-1 whitespace-pre text-[var(--text-secondary)]">
                    {line || " "}
                  </span>
                  {isHighlighted && issue && (
                    <span className="text-[10px] font-mono text-rose-400/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {getSeverityLabel(severity)}
                    </span>
                  )}
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {showSuggestions && issues.length > 0 && (
        <div className="absolute bottom-4 right-4 max-w-sm">
          <div className="rounded-xl bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-subtle)] shadow-[var(--shadow-card-hover)] p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-sm flex-shrink-0 text-white">
                ✨
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  AI Fix Suggestion
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {issues.length} issues detected.
                  <span className="block text-[var(--accent-blue)] mt-1 text-[10px] font-mono">
                    → Use environment variables & add token expiry
                  </span>
                </p>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="mt-2 text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
