import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const models = await openai.listModels();

    const filtered = models.data.data.filter((model: any) =>
        model.owned_by === 'openai'
    )
    res.status(200).json(filtered)
}