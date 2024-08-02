import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com.",
  port: 465,
  secure: true,
  auth: {
    user: process.env.G_USER,
    pass: process.env.G_PASS,
  },
});

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  try {
    const resp = await transporter.sendMail({
      from: process.env.G_USER,
      to: process.env.G_USER,
      subject: "Contact form",
      html: `
            <div style="padding=25px"> 
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Message: ${message}</p>
            </div>
        `,
    });

    console.log("Message sent: %s", resp.messageId);

    return NextResponse.json({ message: "Message sent" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Message failed to send" },
      { status: 500 }
    );
  }
}
