import connectToDatabase from "@/lib/dbConnect";
import { getAdminMailTemplate } from "@/utils/mailTemplate";
import { getMailTransporter } from "@/utils/transporter";
import { generateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { printErr } from "@/lib/logError";
import { guardPublicForm, jsonError, readJsonBody } from "@/lib/security/guard";
import { rateLimit } from "@/lib/security/rateLimit";
import { asString } from "@/lib/security/sanitize";

export const POST = async (req: NextRequest) => {
  const body = await readJsonBody(req, 5_000);
  if (!body) return jsonError("Invalid request", 400);

  // Human check + per-IP throttle (brute-force and credential-stuffing defence)
  const blocked = await guardPublicForm(req, body, {
    scope: "login",
    limit: 15,
    windowSec: 900,
  });
  if (blocked) return blocked;

  const email = asString(body.email);
  const password = asString(body.password);

  if (!email || !password || password.length > 200) {
    return NextResponse.json(
      { success: false, error: true, message: "Missing fields" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase().slice(0, 254);

  // Per-account throttle so a botnet can't hammer a single admin account
  const perAccount = await rateLimit("login-account", normalizedEmail, 8, 900);
  if (!perAccount.allowed) {
    return jsonError("Too many login attempts. Try again in a few minutes.", 429);
  }

  await connectToDatabase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+passwordHash +password"
  );

  if (!user) {
    return NextResponse.json(
      { success: false, error: true, message: "Invalid credentials" },
      { status: 401 }
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

  if (!user.isActive) {
    return NextResponse.json(
      { success: false, error: true, message: "Account is inactive" },
      { status: 403 }
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
