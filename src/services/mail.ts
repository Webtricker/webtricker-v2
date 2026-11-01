import nodemailer from 'nodemailer';

// DISABLE_EMAIL=1 (local review builds): messages are built but never sent
const transporter = process.env.DISABLE_EMAIL === '1'
    ? nodemailer.createTransport({ jsonTransport: true })
    : nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

export default transporter;
