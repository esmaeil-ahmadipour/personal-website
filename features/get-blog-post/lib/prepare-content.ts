// features/get-blog-post/lib/prepare-content.ts
export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

const stripTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

/** Adds ids to h2/h3 (when missing) and returns the table of contents. */
export function prepareContent(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs: string, inner: string) => {
      const text = stripTags(inner);
      if (!text) return match;

      const existing = /\sid=["']([^"']+)["']/i.exec(attrs)?.[1];
      let id = existing ?? (slugify(text) || "section");
      const base = id;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      used.add(id);

      toc.push({ id, text, level: Number(level) as 2 | 3 });
      return existing ? match : `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: out, toc };
}
