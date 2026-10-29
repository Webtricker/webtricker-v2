import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RateLimit from "@/models/RateLimit";

/** Best-effort client IP. Vercel sets x-forwarded-for itself, so the first hop is trustworthy there. */
export const getClientIp = (req: NextRequest): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
};

/** Hash identifiers so raw IPs / emails are never stored in the limiter collection. */
export const hashKey = (value: string): string =>
  createHash("sha256").update(value).digest("hex").slice(0, 32);

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
};

/**
 * Fixed-window counter shared across serverless instances.
 * `scope` names the action, `id` the actor (hashed IP, email, session...).
 */
export async function rateLimit(
  scope: string,
  id: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  await dbConnect();

  const windowMs = windowSec * 1000;
  const now = Date.now();
  const bucket = Math.floor(now / windowMs);
  const windowEnd = (bucket + 1) * windowMs;

  const doc = await RateLimit.findOneAndUpdate(
    { key: `${scope}:${hashKey(id)}:${bucket}` },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt: new Date(windowEnd + 60_000) },
    },
    { upsert: true, new: true }
  );

  const count = doc?.count ?? 1;
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSec: Math.max(1, Math.ceil((windowEnd - now) / 1000)),
  };
}

/** Marks a one-time value as used. Returns false if it was already consumed. */
export async function consumeOnce(key: string, ttlSec: number): Promise<boolean> {
  await dbConnect();
  const doc = await RateLimit.findOneAndUpdate(
    { key: `once:${key}` },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt: new Date(Date.now() + ttlSec * 1000) },
    },
    { upsert: true, new: true }
  );
  return (doc?.count ?? 1) === 1;
}
