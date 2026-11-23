// lib/admin-auth.ts
import { createHash, timingSafeEqual } from "node:crypto";

const MIN_TOKEN_LENGTH = 32;

type Env = Record<string, string | undefined>;

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Fails closed: an unset or too-short ADMIN_API_TOKEN authorizes nobody. */
export function isAdminAuthorized(authorization: string | null, env: Env = process.env): boolean {
  const expected = env.ADMIN_API_TOKEN;
  if (!expected || expected.length < MIN_TOKEN_LENGTH) return false;
  const match = /^Bearer\s+(.+)$/i.exec(authorization ?? "");
  if (!match) return false;
  return timingSafeEqual(digest(match[1]), digest(expected));
}

/** Returns a 401 response to send back, or null when the request is authorized. */
export function requireAdmin(request: Request, env: Env = process.env): Response | null {
  if (isAdminAuthorized(request.headers.get("authorization"), env)) return null;
  return Response.json(
    { success: false, message: "Unauthorized" },
    { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
  );
}
