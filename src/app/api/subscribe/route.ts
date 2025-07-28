import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { generateOTP, isValidEmail } from '@/utils/auth';
import Subscriber from '@/models/Subscriber';
import transporter from '@/services/mail';
import { getSubscribeOTPMailTemplate } from '@/utils/mailTemplate';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
    } catch (error) {
        return NextResponse.json(
            { success: false, message: (error as Error).message },
            { status: 401 }
        );
    }

    try {
        const { email } = await req.json();

        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email' },
                { status: 400 }
            );
        }

        const existingUser = await Subscriber.findOne({ email });

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // If user exists
        if (existingUser) {
            // If already verified
            if (existingUser.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: 'This email is already exist on our webstie.',
                });
            }

            // If OTP is still valid
            if (existingUser.otpExpiresAt > new Date()) {
                return NextResponse.json({
                    success: true,
                    message: 'An OTP has already been sent to your email. Please check your inbox.',
                });
            }

            // OTP expired → generate new and update
            existingUser.otp = otp;
            existingUser.otpExpiresAt = otpExpiresAt;
            await existingUser.save();

            await transporter.sendMail({
                from: `"Webtricker" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Newsletter subscription OTP',
                html: getSubscribeOTPMailTemplate(otp),
            });

            return NextResponse.json({
                success: true,
                message: 'An OTP has been sent to your email.',
            });
        }

        // New user → create and send OTP
        const newUser = await Subscriber.create({
            email,
            otp,
            otpExpiresAt,
        });

        await transporter.sendMail({
            from: `"Webtricker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Newsletter subscription OTP',
            html: getSubscribeOTPMailTemplate(otp),
        });

        return NextResponse.json({
            success: true,
            result: newUser,
            message: 'OTP sent to your email for verification.',
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: `Error processing request: ${error.message}` },
            { status: 500 }
        );
    }
}




export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
    } catch (err: any) {
        console.log(err?.message)
        return NextResponse.json(
            { success: false, message: 'Database connection failed.' },
            { status: 500 }
        );
    }

    try {
        const { email, otp } = await req.json();
        if (!email || !otp) {
            return NextResponse.json(
                { success: false, message: 'Email and OTP are required.' },
                { status: 400 }
            );
        }
        const subscriber = await Subscriber.findOne({ email });

        if (!subscriber) {
            return NextResponse.json(
                { success: false, message: 'Subscriber not found.' },
                { status: 404 }
            );
        }

        if (subscriber.isVerified) {
            return NextResponse.json({
                success: false,
                message: 'This email is already verified.',
            });
        }

        const now = new Date();

        if (subscriber.otpExpiresAt < now) {
            // OTP expired → generate new OTP & expiry
            const newOTP = generateOTP();
            const newExpiry = new Date(now.getTime() + 10 * 60 * 1000); // 10 min from now

            subscriber.otp = newOTP;
            subscriber.otpExpiresAt = newExpiry;
            await subscriber.save();

            // Send new OTP email
            await transporter.sendMail({
                from: `"Webtricker" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your new OTP code',
                html: getSubscribeOTPMailTemplate(newOTP),
            });

            return NextResponse.json({
                success: false,
                message: 'OTP expired. A new OTP has been sent to your email.',
            });
        }

        // OTP not expired, check if matches
        if (subscriber.otp !== otp) {
            return NextResponse.json(
                { success: false, message: 'Invalid OTP.' },
                { status: 400 }
            );
        }

        // OTP valid → mark verified
        subscriber.isVerified = true;
        subscriber.otp = '';
        subscriber.otpExpiresAt = new Date();
        await subscriber.save();

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully.',
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: `Verification failed: ${error.message}` },
            { status: 500 }
        );
    }
}