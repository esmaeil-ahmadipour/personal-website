// prisma/lib/log.ts
//
// Minimal logger plus redaction helpers shared by the seed, content-import and
// release tooling. Nothing here ever prints a connection string or password.

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

const URL_CREDENTIALS = /\b([a-z][a-z0-9+.-]*:\/\/)[^\s/@]+@/gi;
const PASSWORD_PARAM = /\b(password|passwd|pwd)=([^&\s]+)/gi;

/** Masks `scheme://user:password@` and `password=...` fragments in free text. */
export function redact(text: string): string {
  return text
    .replace(URL_CREDENTIALS, "$1***@")
    .replace(PASSWORD_PARAM, "$1=***");
}

/** Redacted, length-limited message suitable for logs and the SeedHistory.error column. */
export function errorMessage(error: unknown, maxLength = 2000): string {
  const raw = error instanceof Error ? error.message : String(error);
  const clean = redact(raw);
  return clean.length > maxLength
    ? `${clean.slice(0, maxLength)}... [truncated]`
    : clean;
}

export function createLogger(prefix: string): Logger {
  const tag = `[${prefix}]`;
  return {
    info: (message) => console.log(`${tag} ${redact(message)}`),
    warn: (message) => console.warn(`${tag} WARN ${redact(message)}`),
    error: (message) => console.error(`${tag} ERROR ${redact(message)}`),
  };
}
