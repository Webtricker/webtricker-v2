import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Consultation from "@/models/Consultation";
import { sendCancellationEmails } from "@/lib/consultation/emails";
import { isSameOrigin, jsonError, readJsonBody } from "@/lib/security/guard";
import { verifyAdmin } from "@/utils/validator";

const STATUSES = ["confirmed", "cancelled", "completed", "no_show"] as const;

// Staff only: change a booking's status. Cancelling emails the visitor.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(req)) return jsonError("Request rejected.", 403);

  try {
    await verifyAdmin(req);
  } catch {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return jsonError("Invalid id", 400);

  const body = await readJsonBody(req, 1_000);
  const status = body?.status;
  if (typeof status !== "string" || !(STATUSES as readonly string[]).includes(status)) {
    return jsonError("Invalid status", 400);
  }

  await dbConnect();
  const booking = await Consultation.findById(id);
  if (!booking) return jsonError("Booking not found", 404);

  const wasConfirmed = booking.status === "confirmed";
  booking.status = status as (typeof STATUSES)[number];
  if (status === "cancelled") booking.cancelledAt = new Date();

  try {
    await booking.save();
  } catch (err: any) {
    // Re-confirming is only possible while nobody else holds the slot.
    if (err?.code === 11000) return jsonError("Another booking already holds that time.", 409);
    throw err;
  }

  if (status === "cancelled" && wasConfirmed) {
    try {
      await sendCancellationEmails(booking.toObject(), String(booking._id), "team");
    } catch (err) {
      console.error("Cancellation email failed:", err);
    }
  }

  return NextResponse.json({ success: true });
}
