"use client";

import { useEffect, useRef } from "react";

interface ArticleBodyProps {
  html: string;
  lang: string;
  dir: "ltr" | "rtl";
  copyLabel: string;
  copiedLabel: string;
}

/** Renders trusted, author-written article HTML and adds a Copy button to code blocks. */
export function ArticleBody({ html, lang, dir, copyLabel, copiedLabel }: ArticleBodyProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const created: HTMLButtonElement[] = [];

    root.querySelectorAll("pre").forEach((pre) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-btn";
      button.textContent = copyLabel;
      button.addEventListener("click", async () => {
        const clone = pre.cloneNode(true) as HTMLElement;
        clone.querySelector(".copy-btn")?.remove();
        try {
          await navigator.clipboard.writeText(clone.textContent ?? "");
          button.textContent = copiedLabel;
          setTimeout(() => (button.textContent = copyLabel), 1500);
        } catch {
          /* clipboard unavailable: leave the label unchanged */
        }
      });
      pre.appendChild(button);
      created.push(button);
    });

    return () => created.forEach((b) => b.remove());
  }, [html, copyLabel, copiedLabel]);

  return (
    <div
      ref={ref}
      className="article-body"
      lang={lang}
      dir={dir}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
