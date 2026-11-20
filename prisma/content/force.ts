// prisma/content/force.ts
//
// Force tokens: one-time, per-post permission to overwrite conflicting fields.
//
// Token format:  <slug>.<43 base64url characters>   (256 random bits)
// Stored form:   "force:" + sha256("content-force:v1:" + token)
//
// Only the stored form ever reaches the database. The raw token is printed once,
// by `pnpm content:force-token`, and is never logged, stored or put in an error
// message. The slug inside the token is what scopes it to a single post.

import { createHash, randomBytes } from "node:crypto";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOKEN = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.([A-Za-z0-9_-]{43})$/;

export class ForceTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForceTokenError";
  }
}

export interface ForceRequest {
  /** The only post the token may be used for. */
  slug: string;
  /** Value recorded in ContentSync.consumedForceTokens once the token is used. */
  marker: string;
}

export function generateForceToken(slug: string): string {
  if (!SLUG.test(slug)) throw new ForceTokenError("The post slug is not a valid slug.");
  return `${slug}.${randomBytes(32).toString("base64url")}`;
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
  return { slug: match[1], marker: forceMarker(token) };
}

/** Defense in depth for log output: removes every occurrence of each secret. */
export function redactSecrets(text: string, secrets: readonly string[]): string {
  let result = text;
  for (const secret of secrets) {
    if (secret.length > 0) result = result.split(secret).join("[redacted]");
  }
  return result;
}
