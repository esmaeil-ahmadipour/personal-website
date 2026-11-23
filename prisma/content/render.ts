// prisma/content/render.ts
//
// Markdown -> sanitized HTML. Order matters: render first, sanitize last, so
// the stored HTML never contains anything the allowlist does not permit.
// Heading ids are NOT generated here: the article page adds them at render
// time (get-blog-post/lib/prepare-content.ts) and keeps any id already present.

import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { ContentError } from "./types";

const markdown = new Marked({ gfm: true, breaks: false, async: false });

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  // h1 is deliberately absent: the page title is the only h1.
  allowedTags: [
    "h2", "h3", "h4", "p", "br", "hr", "ul", "ol", "li", "strong", "em", "del",
    "code", "pre", "blockquote", "a", "img", "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    h2: ["id"],
    h3: ["id"],
    h4: ["id"],
    a: ["href", "title"],
    img: ["src", "alt", "title", "width", "height"],
    code: ["class"],
    th: ["align"],
    td: ["align"],
  },
  allowedClasses: { code: ["language-*"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
};

/** Canonical form used for rendering and hashing: no BOM, LF newlines, trimmed. */
export function normalizeMarkdown(source: string): string {
  return source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
}

export function renderMarkdown(source: string): string {
  const html = markdown.parse(normalizeMarkdown(source), { async: false });
  if (/<h1[\s>]/i.test(html)) {
    throw new ContentError("contains an h1 heading; start at h2 (the page title is the h1)");
  }
  return sanitizeHtml(html, SANITIZE_OPTIONS).trim();
}
