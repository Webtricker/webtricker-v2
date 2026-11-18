import { timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/validator";

export const dynamic = "force-dynamic";

/** Constant-time check of the optional automation secret (set REVALIDATE_SECRET in the host's env). */
const secretMatches = (provided: string | null) => {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
};

/**
 * Instant refresh: clears the cached copies of every public page so content edited in the
 * database or dashboard shows immediately instead of after the normal cache window.
 * Allowed for a signed-in dashboard user, or for automation sending x-revalidate-secret.
 */
export async function POST(req: NextRequest) {
  if (!secretMatches(req.headers.get("x-revalidate-secret"))) {
    try {
      await verifyAdmin(req);
    } catch {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, refreshedAt: new Date().toISOString() });
}
