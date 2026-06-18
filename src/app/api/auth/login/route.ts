import connectToDatabase from "@/lib/dbConnect";
import { getAdminMailTemplate } from "@/utils/mailTemplate";
import { getMailTransporter } from "@/utils/transporter";
import { generateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { printErr } from "@/lib/logError";

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: true, message: "Missing fields" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+passwordHash +password"
  );

  if (!user) {
    return NextResponse.json(
      { success: false, error: true, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  if (!user.isActive) {
    return NextResponse.json(
      { success: false, error: true, message: "Account is inactive" },
      { status: 403 }
    );
  }

  const storedPasswordHash = user.passwordHash || user.password;

  if (!storedPasswordHash) {
    return NextResponse.json(
      { success: false, error: true, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);

  if (!isPasswordValid) {
    return NextResponse.json(
      { success: false, error: true, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const lastLogin = new Date();
  const loginUpdate: Record<string, unknown> = {
    lastLogin,
  };

  if (!user.passwordHash && user.password) {
    loginUpdate.passwordHash = user.password;
  }

  await User.updateOne(
    { _id: user._id },
    {
      $set: loginUpdate,
      ...(user.passwordHash ? {} : { $unset: { password: "" } }),
    }
  );

  // Generate token
  const token = generateToken({
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  });

  // Create the response object
  const response = NextResponse.json({
    success: true,
    error: false,
    message: "Logged in successfully",
    token,
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
  });

  // Set the token in an HTTP-only cookie
  response.cookies.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "strict",
  });

  // Send login notification without blocking the response
  (async () => {
    try {
      const transporter = getMailTransporter();
      const html = getAdminMailTemplate();

      await transporter.sendMail({
        from: process.env.EMAIL_USER || "no-reply@example.com",
        to: process.env.ADMIN_EMAIL || "admin@example.com",
        subject: "Webtricker Admin Login Notification",
        html,
      });
    } catch (err) {
      printErr(err);
    }
  })();

  return response;
};
