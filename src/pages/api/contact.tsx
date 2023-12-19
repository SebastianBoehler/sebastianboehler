import nodemailer from 'nodemailer';

import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 465,
    secure: true,
    auth: {
        user: process.env.G_USER,
        pass: process.env.G_PASS,
    },
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { name, email, message } = req.body;

    try {
        const resp = await transporter.sendMail({
            from: process.env.G_USER,
            to: process.env.G_USER,
            subject: 'Contact form',
            html: `
            <div style="padding=25px"> 
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Message: ${message}</p>
            </div>
        `,
        })

        console.log('Message sent: %s', resp.messageId);

        res.status(200).json({ message: 'Message sent' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Message failed to send' })
    }
}
