import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import dbConnect from "@/lib/dbConnect";
import Consultation from "@/models/Consultation";
import { CONSULTATION } from "@/data/consultation";
import { isSlotOpen, isValidTimezone } from "@/lib/consultation/slots";
import { sendBookingEmails } from "@/lib/consultation/emails";
import { guardPublicForm, jsonError, readJsonBody } from "@/lib/security/guard";
import { getClientIp, hashKey, rateLimit } from "@/lib/security/rateLimit";
import { cleanEmail, cleanLine, cleanPhone, cleanText } from "@/lib/security/sanitize";
import { verifyAdmin } from "@/utils/validator";

const pick = (value: unknown, options: readonly string[]): string | null => {
  const v = cleanLine(value, 100);
  return options.includes(v) ? v : null;
};

// Staff only: list bookings, newest start time first.
export async function GET(req: NextRequest) {
  try {
    await verifyAdmin(req);
  } catch {
    return jsonError("Unauthorized", 401);
  }

  await dbConnect();
  const bookings = await Consultation.find({})
    .sort({ startAt: -1 })
    .limit(300)
    .lean();

  return NextResponse.json({
    success: true,
    timezone: CONSULTATION.timezone,
    bookings: bookings.map((b: any) => ({
      id: String(b._id),
      name: b.name,
      email: b.email,
      phone: b.phone,
      company: b.company,
      service: b.service,
      budget: b.budget,
      message: b.message,
      startAt: b.startAt,
      endAt: b.endAt,
      timezone: b.timezone,
      status: b.status,
      createdAt: b.createdAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const body = await readJsonBody(req, 10_000);
  if (!body) return jsonError("Invalid request", 400);

  const blocked = await guardPublicForm(req, body, {
    scope: "consultation",
    limit: 6,
    windowSec: 3600,
  });
  if (blocked) return blocked;

  const name = cleanLine(body.name, 100);
  const email = cleanEmail(body.email);
  const service = pick(body.service, CONSULTATION.services);
  const budget = body.budget ? pick(body.budget, CONSULTATION.budgets) : "";
  const timezone = isValidTimezone(body.timezone) ? body.timezone : CONSULTATION.timezone;
  const startIso = typeof body.startAt === "string" ? body.startAt : "";

  if (!name || !email || !service || budget === null || !startIso) {
    return jsonError("Please fill in your name, email, topic and pick a time.", 400);
  }

  const perEmail = await rateLimit(
    "consultation-email",
    email,
    CONSULTATION.maxBookingsPerEmailPerDay,
    86400
  );
  if (!perEmail.allowed) {
    return jsonError("Too many bookings for this email today. Please try again tomorrow.", 429);
  }

  try {
    await dbConnect();

    const active = await Consultation.countDocuments({
      email,
      status: "confirmed",
      startAt: { $gt: new Date() },
    });
    if (active >= CONSULTATION.maxActiveBookingsPerEmail) {
      return jsonError(
        "You already have upcoming consultations booked. Please cancel one from your confirmation email to book another.",
        409
      );
    }

    if (!(await isSlotOpen(startIso))) {
      return jsonError("That time was just taken. Please pick another slot.", 409, {
        slotTaken: true,
      });
    }

    const startAt = new Date(startIso);
    const endAt = new Date(startAt.getTime() + CONSULTATION.durationMinutes * 60_000);
    const manageToken = randomBytes(24).toString("hex");

    await Consultation.init(); // make sure the unique slot index exists before relying on it

    let booking;
    try {
      booking = await Consultation.create({
        name,
        email,
        phone: cleanPhone(body.phone),
        company: cleanLine(body.company, 120),
        service,
        budget: budget || undefined,
        message: cleanText(body.message, 2000),
        startAt,
        endAt,
        timezone,
        manageTokenHash: createHash("sha256").update(manageToken).digest("hex"),
        ipHash: hashKey(getClientIp(req)),
      });
    } catch (err: any) {
      if (err?.code === 11000) {
        return jsonError("That time was just taken. Please pick another slot.", 409, {
          slotTaken: true,
        });
      }
      throw err;
    }

    // The booking is saved either way; a mail failure must not lose it.
    try {
      await sendBookingEmails(booking.toObject(), String(booking._id), manageToken);
    } catch (mailError) {
      console.error("Consultation email failed:", mailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your free consultation is booked.",
        booking: { startAt: booking.startAt, endAt: booking.endAt, timezone },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultation booking error:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
