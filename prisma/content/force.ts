// prisma/content/force.ts
//
// Force tokens: one-time, per-item permission to overwrite conflicting fields.
//
// Token format:  <slug>.<43 base64url characters>   (256 random bits), for posts
//                <kind>:<slug>.<43 characters>      for category, tag, project, newsletter
// Stored form:   "force:" + sha256("content-force:v1:" + token)
//
// Only the stored form ever reaches the database. The raw token is printed once,
// by `pnpm content:force-token`, and is never logged, stored or put in an error
// message. The slug (and kind) inside the token scope it to a single item.

import { createHash, randomBytes } from "node:crypto";
import type { ContentKind } from "./types";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOKEN = /^(?:(category|tag|project|newsletter):)?([a-z0-9]+(?:-[a-z0-9]+)*)\.([A-Za-z0-9_-]{43})$/;

export class ForceTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForceTokenError";
  }
}

export interface ForceRequest {
  /** The only item the token may be used for. */
  slug: string;
  /** Kind of the item. Absent for posts, whose tokens keep the original format. */
  kind?: Exclude<ContentKind, "post">;
  /** Value recorded in ContentSync.consumedForceTokens once the token is used. */
  marker: string;
}

/** The kind a request is scoped to. */
export function forceKind(request: ForceRequest): ContentKind {
  return request.kind ?? "post";
}

export function generateForceToken(slug: string, kind: ContentKind = "post"): string {
  if (!SLUG.test(slug)) throw new ForceTokenError("The post slug is not a valid slug.");
  const prefix = kind === "post" ? "" : `${kind}:`;
  return `${prefix}${slug}.${randomBytes(32).toString("base64url")}`;
}

export function forceMarker(token: string): string {
  const digest = createHash("sha256").update(`content-force:v1:${token}`, "utf8").digest("hex");
  return `force:${digest}`;
}

/** Never echoes the input: a malformed token may still be a real secret. */
export function parseForceToken(token: string): ForceRequest {
  const match = TOKEN.exec(token);
  if (match === null) {
    throw new ForceTokenError(
      "CONTENT_FORCE_TOKEN is malformed (expected <slug>.<43 characters>). " +
        "Generate one with `pnpm content:force-token <slug>`.",
    );
  }
  const [, kind, slug] = match;
  const marker = forceMarker(token);
  return kind === undefined
    ? { slug, marker }
    : { slug, marker, kind: kind as Exclude<ContentKind, "post"> };
}

/** Defense in depth for log output: removes every occurrence of each secret. */
export function redactSecrets(text: string, secrets: readonly string[]): string {
  let result = text;
  for (const secret of secrets) {
    if (secret.length > 0) result = result.split(secret).join("[redacted]");
  }
  return result;
}
