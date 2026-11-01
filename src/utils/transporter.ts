import nodemailer from "nodemailer";

export const getMailTransporter = () => {
    // DISABLE_EMAIL=1 (local review builds): messages are built but never sent
    if (process.env.DISABLE_EMAIL === "1") {
        return nodemailer.createTransport({ jsonTransport: true });
    }

    const transporter = nodemailer.createTransport({
           service: "gmail",
           auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASS,
           },
       });

    return transporter;
}
