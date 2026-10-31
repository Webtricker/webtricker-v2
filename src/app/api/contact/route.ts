import transporter from "@/services/mail";
import { getThankingMailTemplate } from "@/utils/mailTemplate";
import { NextRequest, NextResponse } from "next/server";
import { guardPublicForm, jsonError, readJsonBody } from "@/lib/security/guard";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { cleanEmail, cleanLine, cleanText, escapeHtml, toSafeHtml } from "@/lib/security/sanitize";

export const POST = async (req: NextRequest) => {
    const body = await readJsonBody(req);
    if (!body) return jsonError("Invalid request", 400);

    const blocked = await guardPublicForm(req, body, {
        scope: "contact",
        limit: 5,
        windowSec: 3600,
    });
    if (blocked) return blocked;

    const name = cleanLine(body.name, 100);
    const email = cleanEmail(body.email);
    const message = cleanText(body.message, 5000);
    if (!name || !email || !message) {
        return jsonError("Missing or invalid fields", 400);
    }

    // The thank-you mail goes to whatever address was typed, so cap it per address too.
    const perEmail = await rateLimit("contact-email", email, 2, 3600);
    if (!perEmail.allowed) {
        return jsonError("Too many requests. Please try again later.", 429);
    }

    try {
        await transporter.sendMail({
            from: `"Webtricker Contact" <${process.env.EMAIL_USER}>`,
            replyTo: { name, address: email },
            to: process.env.EMAIL_TO,
            subject: "New Contact Message from Webtricker",
            html: `
         <p>You have received a new message from ${escapeHtml(name)} (${escapeHtml(email)})</p>
         <br />
        <p><strong>Message:</strong><br/>${toSafeHtml(message)}</p>
        <p style="color:#888;font-size:12px">Sender IP:${escapeHtml(getClientIp(req).slice(0, 45))}</p>
      `,
        });

        await transporter.sendMail({
            from: `"Webtricker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Feedback from Webtricker",
            html: getThankingMailTemplate(),
        });

        return NextResponse.json({ success: true, error: false, message: "Contact form submitted" }, { status: 200 });
    } catch (err) {
        console.error("Email sending error:", err);
        return jsonError("Failed to send email", 500);
    }
}
