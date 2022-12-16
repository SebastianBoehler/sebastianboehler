import type { NextApiRequest, NextApiResponse } from 'next'

const promts = {
    Article: `This is a short article about`,
}
type types = keyof typeof promts

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(404).json({ message: 'Not Found' })
        return
    }

    const { textType } = req.body as { textType: types }

    res.status(200).send(promts[textType] || 'No prompt found')
}