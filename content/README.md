# Content

Posts live here as plain files and are validated offline with `pnpm content:validate`.
The database import (Phase 4) is a separate step; nothing in this directory touches a database.

```
content/
  manifest.json            { "posts": [ "<slug>", ... ] }  slugs released to production
  posts/<slug>/
    post.yml               metadata (see below)
    en.md  fa.md           required Markdown bodies
    ar.md                  optional; must match `locales.ar` in post.yml
```

Posts that are not listed in `manifest.json` are validated but stay development-only.

## post.yml

```yaml
slug: my-post                    # must equal the directory name
author: esmaeil-ahmadipour       # slugs of existing Author / Category / Tag rows
category: engineering
tags: [flutter, architecture]
language: en                     # en | fa | ar (default en)
status: published                # draft | pending | published
publishedAt: "2025-01-15"        # quoted; "YYYY-MM-DD" or ISO UTC timestamp; required when published
isFeatured: false                # optional booleans, default false
isTrending: false
isPinned: false
priority: 1                      # integer, default 0
readingTimeMin: 5                # optional
coverImageUrl: /images/blog/x.jpg
locales:
  en:                            # en and fa are required, ar is optional
    title: "..."                 # required
    excerpt: "..."               # optional: excerpt, seoTitle, seoDescription, keywords, ogImage
```

Unknown keys are errors.

## Markdown rules

- Start at `##`: the page title is the only h1, so `#` (and raw `<h1>`) is rejected.
- Heading ids are added by the article page at render time; do not write them by hand
  (an `id` you do write on h2-h4 is kept).
- HTML is rendered with `marked` and then sanitized with an allowlist; scripts, event
  handlers, `javascript:`/`data:` URLs and unknown tags are removed.
- Code blocks keep a `language-*` class only.
