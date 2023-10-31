import {OpenAIApi, Configuration} from "openai-edge"

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

export async function getEmbeddings(text: string){
    try {
        const respone = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, '')
        })
        const result = await respone.json()
        return result.data[0].embedding as number[]
    } catch (error) {
        console.log("Unable to fetch OpenAi Embeddings",error)
        throw error
    }
}