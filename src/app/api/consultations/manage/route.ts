import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import dbConnect from "@/lib/dbConnect";
import Consultation from "@/models/Consultation";
import { sendCancellationEmails } from "@/lib/consultation/emails";
import { isSameOrigin, jsonError, readJsonBody } from "@/lib/security/guard";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { asString } from "@/lib/security/sanitize";

const TOKEN_RE = /^[0-9a-f]{48}$/;

const findByToken = async (token: unknown) => {
  const value = asString(token);
  if (!value || !TOKEN_RE.test(value)) return null;
  await dbConnect();
  return Consultation.findOne({
    manageTokenHash: createHash("sha256").update(value).digest("hex"),
  }).select("+manageTokenHash");
};

// Booking summary for the "manage your booking" page.
export async function GET(req: NextRequest) {
  const limited = await rateLimit("consult-manage", getClientIp(req), 30, 600);
  if (!limited.allowed) return jsonError("Too many requests.", 429);

  const booking = await findByToken(req.nextUrl.searchParams.get("token"));
  if (!booking) return jsonError("Booking not found.", 404);

  return NextResponse.json({
    success: true,
    booking: {
      name: booking.name,
      service: booking.service,
      startAt: booking.startAt,
      endAt: booking.endAt,
      timezone: booking.timezone,
      status: booking.status,
    },
  });
}

// Cancel the booking (frees the slot).
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return jsonError("Request rejected.", 403);

  const limited = await rateLimit("consult-cancel", getClientIp(req), 10, 600);
  if (!limited.allowed) return jsonError("Too many requests.", 429);

  const body = await readJsonBody(req, 2_000);
  if (!body) return jsonError("Invalid request", 400);

  const booking = await findByToken(body.token);
  if (!booking) return jsonError("Booking not found.", 404);

  if (booking.status !== "confirmed") {
    return jsonError("This booking is no longer active.", 409);
  }
  if (booking.startAt.getTime() <= Date.now()) {
    return jsonError("This consultation has already started.", 409);
  }

  booking.status = "cancelled";
  booking.cancelledAt = new Date();
  await booking.save();

  try {
    await sendCancellationEmails(booking.toObject(), String(booking._id), "client");
  } catch (err) {
    console.error("Cancellation email failed:", err);
  }

  return NextResponse.json({ success: true, message: "Your consultation was cancelled." });
}
