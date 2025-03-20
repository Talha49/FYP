import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { to, subject, html } = await req.json();

        if (!to) {
            console.error("❌ Email Error: No recipient provided");
            return NextResponse.json({ success: false, error: "No recipient defined" }, { status: 400 });
        }

        // Email transporter setup
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"Task Manager" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        return NextResponse.json({ success: true, message: "Email sent successfully" });

    } catch (error) {
        console.error("❌ Email Sending Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
