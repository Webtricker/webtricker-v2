// Input hygiene helpers used by every public endpoint.

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Returns the value only when it is a real string (blocks `{ "$ne": null }` style objects). */
export const asString = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

/** Single-line text: no control characters or line breaks, trimmed and length-capped. */
export const cleanLine = (value: unknown, max = 200): string => {
  const str = asString(value) ?? "";
  return str.replace(/[\r\n\t]+/g, " ").replace(CONTROL_CHARS, "").trim().slice(0, max);
};

/** Multi-line text: keeps newlines, strips control characters, length-capped. */
export const cleanText = (value: unknown, max = 5000): string => {
  const str = asString(value) ?? "";
  return str.replace(/\r\n?/g, "\n").replace(CONTROL_CHARS, "").trim().slice(0, max);
};

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Escapes text for an HTML email body and keeps line breaks. */
export const toSafeHtml = (value: string): string =>
  escapeHtml(value).replace(/\n/g, "<br/>");

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const cleanEmail = (value: unknown): string | null => {
  const email = cleanLine(value, 254).toLowerCase();
  return EMAIL_RE.test(email) ? email : null;
};

export const cleanPhone = (value: unknown): string =>
  cleanLine(value, 30).replace(/[^\d+()\-\s.]/g, "");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: unknown): value is string =>
  typeof value === "string" && UUID_RE.test(value);
