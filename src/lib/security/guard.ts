import { NextRequest, NextResponse } from "next/server";
import { captchaMessage, verifyChallenge } from "./captcha";
import { getClientIp, rateLimit } from "./rateLimit";

const stripWww = (host: string) => host.replace(/^www\./, "").toLowerCase();

/**
 * Browsers always send Origin on cross-site and same-site POSTs. Requests whose
 * Origin is missing or points at another site are not coming from our pages.
 */
export const isSameOrigin = (req: NextRequest): boolean => {
  const origin = req.headers.get("origin");
  if (!origin) return false;

  let originHost: string;
  try {
    originHost = stripWww(new URL(origin).host);
  } catch {
    return false;
  }

  const allowed = new Set<string>();
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) allowed.add(stripWww(host));
  try {
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      allowed.add(stripWww(new URL(process.env.NEXT_PUBLIC_BASE_URL).host));
    }
  } catch {
    /* ignore a malformed base URL */
  }
  return allowed.has(originHost);
};

export const jsonError = (
  message: string,
  status: number,
  extra: Record<string, unknown> = {}
) =>
  NextResponse.json({ success: false, error: true, message, ...extra }, { status });

/** Parses a small JSON object body. Returns null for oversized, malformed or non-object bodies. */
export async function readJsonBody(
  req: NextRequest,
  maxBytes = 20_000
): Promise<Record<string, unknown> | null> {
  const length = Number(req.headers.get("content-length") || 0);
  if (length > maxBytes) return null;
  try {
    const text = await req.text();
    if (text.length > maxBytes) return null;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

type GuardOptions = {
  /** Name of the action, used as the rate-limit bucket. */
  scope: string;
  /** Max requests per IP in the window. */
  limit: number;
  windowSec: number;
  /** Require the math challenge (default true). */
  captcha?: boolean;
};

/**
 * Common gate for public forms: same-origin check, per-IP rate limit, honeypot,
 * then the math challenge. Returns a response to send back, or null to proceed.
 */
export async function guardPublicForm(
  req: NextRequest,
  body: Record<string, unknown>,
  { scope, limit, windowSec, captcha = true }: GuardOptions
): Promise<NextResponse | null> {
  if (!isSameOrigin(req)) return jsonError("Request rejected.", 403);

  const limited = await rateLimit(scope, getClientIp(req), limit, windowSec);
  if (!limited.allowed) {
    const res = jsonError("Too many requests. Please try again later.", 429);
    res.headers.set("Retry-After", String(limited.retryAfterSec));
    return res;
  }

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ success: true, message: "Thank you!" }, { status: 200 });
  }

  if (captcha) {
    const result = await verifyChallenge(body.captchaToken, body.captchaAnswer);
    if (!result.ok) {
      return jsonError(captchaMessage(result.reason), 400, {
        captchaFailed: true,
      });
    }
  }

  return null;
}
