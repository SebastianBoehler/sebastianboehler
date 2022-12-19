import { Configuration, OpenAIApi } from 'openai'

class OpenAI {
    private apiKey: string
    private model: string
    private openai: OpenAIApi

    constructor(apiKey: string, model: string) {
        this.apiKey = apiKey
        this.model = model

        const configuration = new Configuration({
            apiKey: this.apiKey,
        });
        this.openai = new OpenAIApi(configuration);
    }

    public async runPrompt(prompt: string) {
        const response = await this.openai.createCompletion({
            prompt,
            model: this.model,
            temperature: 0.9,
            max_tokens: 400,
            //frequencyPenalty: 0,
            //presencePenalty: 0,
            //stop: ['\n', '###'],
            logprobs: 5,
            user: 'openai', //TODO: IP or UID
        })

        return response.data.choices[0].text
    };

    public async fixTone(text: string, tone: string) {
        const response = await this.openai.createCompletion({
            prompt: `Rewrite this text in a ${tone} tone:\n\n${text}`,
            model: 'text-davinci-003',
            temperature: 0.9,
            max_tokens: 400,
            //frequencyPenalty: 0,
            //presencePenalty: 0,
            //stop: ['\n', '###'],
            logprobs: 5,
            user: 'openai', //TODO: IP or UID
        })

        return response.data.choices[0].text
    }

    public async listModels() {
        const models = await this.openai.listModels();

        const filtered = models.data.data.filter((model: any) =>
            model.owned_by === 'openai'
        )

        return filtered
    }
}

export default OpenAI
