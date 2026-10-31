import transporter from "@/services/mail";
import { CONSULTATION } from "@/data/consultation";
import { escapeHtml, toSafeHtml } from "@/lib/security/sanitize";
import type { IConsultation } from "@/models/Consultation";

const baseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "https://webtricker.com";

export const manageUrl = (token: string) =>
  `${baseUrl()}/free-consultation/manage?token=${encodeURIComponent(token)}`;

const formatIn = (date: Date, tz: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);

const icsStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

const buildIcs = (c: IConsultation, uid: string, method: "REQUEST" | "CANCEL") =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Webtricker//Free Consultation//EN",
    `METHOD:${method}`,
    "BEGIN:VEVENT",
    `UID:${uid}@webtricker.com`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(c.startAt)}`,
    `DTEND:${icsStamp(c.endAt)}`,
    `SUMMARY:${icsText("Free consultation with Webtricker")}`,
    `DESCRIPTION:${icsText(
      `A ${CONSULTATION.durationMinutes}-minute call about: ${c.service}. We will email the meeting link before the call.`
    )}`,
    `ORGANIZER;CN=Webtricker:mailto:${process.env.EMAIL_USER}`,
    `ATTENDEE;CN=${icsText(c.name)}:mailto:${c.email}`,
    `STATUS:${method === "CANCEL" ? "CANCELLED" : "CONFIRMED"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

const wrap = (body: string) => `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;line-height:1.55">
    ${body}
    <p style="color:#777;font-size:12px;margin-top:28px">Webtricker LLC · <a href="${baseUrl()}">webtricker.com</a></p>
  </div>`;

export async function sendBookingEmails(c: IConsultation, id: string, manageToken: string) {
  const link = manageUrl(manageToken);
  const when = formatIn(c.startAt, c.timezone);
  const whenOffice = formatIn(c.startAt, CONSULTATION.timezone);

  await transporter.sendMail({
    from: `"Webtricker" <${process.env.EMAIL_USER}>`,
    to: c.email,
    subject: "Your free consultation with Webtricker is booked",
    html: wrap(`
      <h2 style="margin:0 0 12px">You're booked, ${escapeHtml(c.name)}!</h2>
      <p>Your free ${CONSULTATION.durationMinutes}-minute consultation is confirmed.</p>
      <p style="background:#f4f4f5;padding:14px 16px;border-radius:8px">
        <strong>${escapeHtml(when)}</strong><br/>
        <span style="color:#555">${escapeHtml(c.timezone)} · ${escapeHtml(whenOffice)} (${escapeHtml(CONSULTATION.timezone)})</span>
      </p>
      <p>Topic: <strong>${escapeHtml(c.service)}</strong></p>
      <p>We will email you the meeting link before the call. A calendar invite is attached.</p>
      <p>Need to cancel or change the time? <a href="${link}">Manage your booking</a>.</p>`),
    icalEvent: { method: "REQUEST", filename: "consultation.ics", content: buildIcs(c, id, "REQUEST") },
  });

  const to = process.env.EMAIL_TO;
  if (to) {
    await transporter.sendMail({
      from: `"Webtricker Bookings" <${process.env.EMAIL_USER}>`,
      to,
      replyTo: { name: c.name, address: c.email },
      subject: `New consultation: ${c.name} · ${whenOffice}`,
      html: wrap(`
        <h2 style="margin:0 0 12px">New free consultation booked</h2>
        <p><strong>${escapeHtml(whenOffice)}</strong> (${escapeHtml(CONSULTATION.timezone)})<br/>
        Visitor's time: ${escapeHtml(when)} (${escapeHtml(c.timezone)})</p>
        <table style="border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;color:#777">Name</td><td>${escapeHtml(c.name)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#777">Email</td><td>${escapeHtml(c.email)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#777">Phone</td><td>${escapeHtml(c.phone || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#777">Company</td><td>${escapeHtml(c.company || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#777">Service</td><td>${escapeHtml(c.service)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#777">Budget</td><td>${escapeHtml(c.budget || "—")}</td></tr>
        </table>
        <p><strong>Project details</strong><br/>${toSafeHtml(c.message || "—")}</p>
        <p>Reply to this email to send them the meeting link.</p>`),
      icalEvent: { method: "REQUEST", filename: "consultation.ics", content: buildIcs(c, id, "REQUEST") },
    });
  }
}

export async function sendCancellationEmails(c: IConsultation, id: string, by: "client" | "team") {
  const when = formatIn(c.startAt, c.timezone);

  await transporter.sendMail({
    from: `"Webtricker" <${process.env.EMAIL_USER}>`,
    to: c.email,
    subject: "Your Webtricker consultation was cancelled",
    html: wrap(`
      <h2 style="margin:0 0 12px">Consultation cancelled</h2>
      <p>Hi ${escapeHtml(c.name)}, your consultation on <strong>${escapeHtml(when)}</strong> has been cancelled${by === "team" ? " by our team" : ""}.</p>
      <p>You are welcome to <a href="${baseUrl()}/free-consultation">book another time</a>.</p>`),
    icalEvent: { method: "CANCEL", filename: "cancelled.ics", content: buildIcs(c, id, "CANCEL") },
  });

  if (by === "client" && process.env.EMAIL_TO) {
    await transporter.sendMail({
      from: `"Webtricker Bookings" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Consultation cancelled: ${c.name}`,
      html: wrap(`<p>${escapeHtml(c.name)} (${escapeHtml(c.email)}) cancelled their consultation on <strong>${escapeHtml(
        formatIn(c.startAt, CONSULTATION.timezone)
      )}</strong> (${escapeHtml(CONSULTATION.timezone)}).</p>`),
    });
  }
}
