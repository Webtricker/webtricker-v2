import { verifyToken } from "@/lib/auth";
import type { IUser } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

type DecodedAccessToken = {
  role?: string;
};

export const requireSuperAdmin = (req: NextRequest) => {
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

  if ((decoded as DecodedAccessToken).role !== "superAdmin") {
    return NextResponse.json(
      { success: false, error: true, message: "Forbidden" },
      { status: 403 }
    );
  }

  return null;
};

export const sanitizeUser = (user: IUser) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  isActive: user.isActive,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
});
