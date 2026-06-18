import connectToDatabase from "@/lib/dbConnect";
import User, { USER_ROLES, UserRole } from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin, sanitizeUser } from "../_utils";

const isValidRole = (role: unknown): role is UserRole =>
  typeof role === "string" && USER_ROLES.includes(role as UserRole);

const invalidIdResponse = () =>
  NextResponse.json(
    { success: false, error: true, message: "Invalid user id" },
    { status: 400 }
  );

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const forbiddenResponse = requireSuperAdmin(req);
  if (forbiddenResponse) return forbiddenResponse;

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidIdResponse();

  try {
    await connectToDatabase();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: true, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user: sanitizeUser(user) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const forbiddenResponse = requireSuperAdmin(req);
  if (forbiddenResponse) return forbiddenResponse;

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidIdResponse();

  try {
    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.name !== undefined) update.name = body.name;
    if (body.email !== undefined) {
      update.email = String(body.email).trim().toLowerCase();
    }
    if (body.avatar !== undefined) update.avatar = body.avatar;
    if (body.isActive !== undefined) update.isActive = body.isActive;

    if (body.role !== undefined) {
      if (!isValidRole(body.role)) {
        return NextResponse.json(
          { success: false, error: true, message: "Invalid role" },
          { status: 400 }
        );
      }

      update.role = body.role;
    }

    if (body.password) {
      update.passwordHash = await bcrypt.hash(body.password, 10);
    }

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: true, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user: sanitizeUser(user) },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: true, message: "Email already exists" },
        { status: 409 }
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const forbiddenResponse = requireSuperAdmin(req);
  if (forbiddenResponse) return forbiddenResponse;

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return invalidIdResponse();

  try {
    await connectToDatabase();
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: true, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
