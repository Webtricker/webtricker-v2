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

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { success: false, error: true, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      { success: false, error: true, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Generate token
  const token = generateToken({
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Create the response object
  const response = NextResponse.json({
    success: true,
    error: false,
    message: "Logged in successfully",
    token,
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });

  // Set the token in an HTTP-only cookie
  response.cookies.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week (adjust as needed)
    path: "/",
    sameSite: "strict",
  });
  return response;

  // Send email to site admin
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
};
