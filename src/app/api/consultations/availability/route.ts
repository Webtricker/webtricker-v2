import { NextRequest, NextResponse } from "next/server";
import { CONSULTATION } from "@/data/consultation";
import { getAvailability } from "@/lib/consultation/slots";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const limited = await rateLimit("consult-availability", getClientIp(req), 60, 600);
  if (!limited.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const days = await getAvailability();
    return NextResponse.json({
      success: true,
      timezone: CONSULTATION.timezone,
      durationMinutes: CONSULTATION.durationMinutes,
      services: CONSULTATION.services,
      budgets: CONSULTATION.budgets,
      days,
    });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json(
      { success: false, message: "Could not load availability." },
      { status: 500 }
    );
  }
}
