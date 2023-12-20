import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).end();
        return;
    }

    const filePath = path.join(process.cwd(), 'public', 'cv.pdf');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).end();
            return;
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Sebastian Boehler CV.pdf"');
        res.send(data);
    });
}
