import { verifyToken } from "@/lib/auth";
import type { ITag } from "@/models/Tag";
import { NextRequest, NextResponse } from "next/server";

type DecodedAccessToken = {
  role?: string;
};

const TAG_EDITOR_ROLES = ["superAdmin", "editor"];

export const requireTagEditor = (req: NextRequest) => {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: true, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);

  if (!decoded || typeof decoded === "string") {
    return NextResponse.json(
      { success: false, error: true, message: "Invalid token" },
      { status: 401 }
    );
  }

  if (!TAG_EDITOR_ROLES.includes((decoded as DecodedAccessToken).role || "")) {
    return NextResponse.json(
      { success: false, error: true, message: "Forbidden" },
      { status: 403 }
    );
  }

  return null;
};

export const sanitizeTag = (tag: ITag) => ({
  id: String(tag._id),
  name: tag.name,
  slug: tag.slug,
  color: tag.color,
  postCount: tag.postCount,
  createdAt: tag.createdAt,
});
