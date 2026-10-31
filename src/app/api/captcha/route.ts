import { NextRequest, NextResponse } from "next/server";
import { createChallenge } from "@/lib/security/captcha";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const limited = await rateLimit("captcha-issue", getClientIp(req), 60, 600);
  if (!limited.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  const { question, token } = createChallenge();
  return NextResponse.json(
    { success: true, question, token },
    { headers: { "Cache-Control": "no-store" } }
  );
}
