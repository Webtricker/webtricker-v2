import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type SessionPayload = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
};

export const GET = async (req: NextRequest) => {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded || typeof decoded === "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = decoded as SessionPayload;

  if (!payload.email || !payload.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      id: payload.id || "",
      name: payload.name || payload.email,
      email: payload.email,
      role: payload.role,
      avatar: payload.avatar,
    },
    { status: 200 }
  );
};
