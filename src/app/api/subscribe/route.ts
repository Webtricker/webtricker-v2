import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomInt, timingSafeEqual } from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Subscriber from '@/models/Subscriber';
import transporter from '@/services/mail';
import { getSubscribeOTPMailTemplate } from '@/utils/mailTemplate';
import { guardPublicForm, isSameOrigin, jsonError, readJsonBody } from '@/lib/security/guard';
import { getClientIp, rateLimit } from '@/lib/security/rateLimit';
import { asString, cleanEmail } from '@/lib/security/sanitize';

const OTP_TTL_MS = 10 * 60 * 1000;

// Codes are stored hashed, so a database read alone cannot reveal a pending OTP.
const hashOtp = (otp: string) => createHash('sha256').update(otp).digest('hex');
const generateOtp = () => String(randomInt(100000, 1000000));

const sendOtp = (email: string, otp: string, subject = 'Newsletter subscription OTP') =>
    transporter.sendMail({
        from: `"Webtricker" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: getSubscribeOTPMailTemplate(otp),
    });

export async function POST(req: NextRequest) {
    const body = await readJsonBody(req, 5_000);
    if (!body) return jsonError('Invalid request', 400);

    const blocked = await guardPublicForm(req, body, {
        scope: 'subscribe',
        limit: 8,
        windowSec: 3600,
    });
    if (blocked) return blocked;

    const email = cleanEmail(body.email);
    if (!email) return jsonError('Invalid email', 400);

    // Stops the form being used to mail-bomb somebody else's inbox.
    const perEmail = await rateLimit('subscribe-email', email, 3, 3600);
    if (!perEmail.allowed) {
        return jsonError('Too many requests for this email. Please try again later.', 429);
    }

    try {
        await dbConnect();
        const existing = await Subscriber.findOne({ email });
        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

        if (existing) {
            if (existing.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: 'This email is already subscribed.',
                });
            }

            if (existing.otpExpiresAt > new Date()) {
                return NextResponse.json({
                    success: true,
                    message: 'An OTP has already been sent to your email. Please check your inbox.',
                });
            }

            existing.otp = hashOtp(otp);
            existing.otpExpiresAt = otpExpiresAt;
            await existing.save();
            await sendOtp(email, otp);

            return NextResponse.json({
                success: true,
                message: 'An OTP has been sent to your email.',
            });
        }

        await Subscriber.create({ email, otp: hashOtp(otp), otpExpiresAt });
        await sendOtp(email, otp);

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email for verification.',
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        return jsonError('Something went wrong. Please try again.', 500);
    }
}

export async function PUT(req: NextRequest) {
    if (!isSameOrigin(req)) return jsonError('Request rejected.', 403);

    const body = await readJsonBody(req, 5_000);
    if (!body) return jsonError('Invalid request', 400);

    const email = cleanEmail(body.email);
    const otp = asString(body.otp)?.trim() ?? '';
    if (!email || !/^\d{6}$/.test(otp)) {
        return jsonError('Email and a 6-digit OTP are required.', 400);
    }

    // A 6-digit code is only safe if guessing is capped: 5 tries per email, 20 per IP.
    const [perEmail, perIp] = await Promise.all([
        rateLimit('subscribe-verify-email', email, 5, 600),
        rateLimit('subscribe-verify-ip', getClientIp(req), 20, 600),
    ]);
    if (!perEmail.allowed || !perIp.allowed) {
        return jsonError('Too many attempts. Please wait a few minutes and try again.', 429);
    }

    try {
        await dbConnect();
        const subscriber = await Subscriber.findOne({ email });

        if (!subscriber) {
            return jsonError('Subscriber not found.', 404);
        }

        if (subscriber.isVerified) {
            return NextResponse.json({
                success: false,
                message: 'This email is already verified.',
            });
        }

        if (subscriber.otpExpiresAt < new Date()) {
            const newOtp = generateOtp();
            subscriber.otp = hashOtp(newOtp);
            subscriber.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
            await subscriber.save();
            await sendOtp(email, newOtp, 'Your new OTP code');

            return NextResponse.json({
                success: false,
                message: 'OTP expired. A new OTP has been sent to your email.',
            });
        }

        const expected = Buffer.from(String(subscriber.otp));
        const received = Buffer.from(hashOtp(otp));
        const matches = expected.length === received.length && timingSafeEqual(expected, received);
        if (!matches) {
            return jsonError('Invalid OTP.', 400);
        }

        subscriber.isVerified = true;
        subscriber.otp = '';
        subscriber.otpExpiresAt = new Date();
        await subscriber.save();

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully.',
        });
    } catch (error) {
        console.error('Subscribe verify error:', error);
        return jsonError('Verification failed. Please try again.', 500);
    }
}
