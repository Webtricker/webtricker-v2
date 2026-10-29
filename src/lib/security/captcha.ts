import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { consumeOnce } from "./rateLimit";

// Self-hosted human check: a signed, expiring, single-use arithmetic question.
// Nothing is stored when a challenge is issued; the answer travels inside an
// HMAC-signed token, so the client can never read or forge it.

const TTL_MS = 10 * 60 * 1000; // challenge lifetime
const MIN_SOLVE_MS = 2500; // anything solved faster than this is a script

const secret = () => {
  const base = process.env.JWT_SECRET;
  if (!base) throw new Error("JWT_SECRET is not set");
  return createHmac("sha256", base).update("webtricker-captcha-v1").digest();
};

const sign = (payload: string, answer: number) =>
  createHmac("sha256", secret()).update(`${payload}.${answer}`).digest("base64url");

export type CaptchaChallenge = { question: string; token: string };

export function createChallenge(): CaptchaChallenge {
  const ops = ["+", "-", "×"] as const;
  const op = ops[randomInt(ops.length)];
  let a = randomInt(2, 13);
  let b = randomInt(2, 10);
  if (op === "-" && b > a) [a, b] = [b, a]; // never a negative answer
  const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;

  const payload = Buffer.from(
    JSON.stringify({ n: randomBytes(9).toString("base64url"), i: Date.now() })
  ).toString("base64url");

  return { question: `${a} ${op} ${b}`, token: `${payload}.${sign(payload, answer)}` };
}

export type CaptchaFailure = "missing" | "invalid" | "expired" | "too_fast" | "reused";

/** Verifies a submitted answer. Each token is accepted once, even if the answer was right. */
export async function verifyChallenge(
  token: unknown,
  answer: unknown
): Promise<{ ok: true } | { ok: false; reason: CaptchaFailure }> {
  if (typeof token !== "string" || answer === undefined || answer === null || answer === "") {
    return { ok: false, reason: "missing" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "invalid" };
  const [payload, signature] = parts;

  const numeric = Number(String(answer).trim());
  if (!Number.isInteger(numeric)) return { ok: false, reason: "invalid" };

  const expected = Buffer.from(sign(payload, numeric));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return { ok: false, reason: "invalid" };
  }

  let data: { n?: string; i?: number };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (typeof data.n !== "string" || typeof data.i !== "number") {
    return { ok: false, reason: "invalid" };
  }

  const age = Date.now() - data.i;
  if (age > TTL_MS) return { ok: false, reason: "expired" };
  if (age < MIN_SOLVE_MS) return { ok: false, reason: "too_fast" };

  if (!(await consumeOnce(`captcha:${data.n}`, TTL_MS / 1000 + 60))) {
    return { ok: false, reason: "reused" };
  }
  return { ok: true };
}

export const captchaMessage = (reason: CaptchaFailure): string => {
  switch (reason) {
    case "expired":
      return "The security check expired. Please solve the new question.";
    case "too_fast":
      return "That was too fast. Please wait a moment and try again.";
    case "reused":
    case "invalid":
      return "The security answer is incorrect. Please try the new question.";
    default:
      return "Please answer the security question.";
  }
};
