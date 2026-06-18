import connectToDatabase from "@/lib/dbConnect";
import User, { USER_ROLES, UserRole } from "@/models/User";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin, sanitizeUser } from "./_utils";

const isValidRole = (role: unknown): role is UserRole =>
  typeof role === "string" && USER_ROLES.includes(role as UserRole);

export const GET = async (req: NextRequest) => {
  const forbiddenResponse = requireSuperAdmin(req);
  if (forbiddenResponse) return forbiddenResponse;

  try {
    await connectToDatabase();
    const users = await User.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, users: users.map(sanitizeUser) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  const forbiddenResponse = requireSuperAdmin(req);
  if (forbiddenResponse) return forbiddenResponse;

  try {
    const { name, email, password, role, avatar, isActive } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: true, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (role && !isValidRole(role)) {
      return NextResponse.json(
        { success: false, error: true, message: "Invalid role" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "intern",
      avatar,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return NextResponse.json(
      { success: true, user: sanitizeUser(user) },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: true, message: "Email already exists" },
        { status: 409 }
      );
    }

    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
