import { PineconeClient } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string){
    const pinecone = new PineconeClient()
    await pinecone.init({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!
    })
    const index = await pinecone.Index('pdfile-ai')

    try {
        const namespace = convertToAscii(fileKey)
        const queryResult = await index.query({
            queryRequest: {
                topK: 5, //returns the 5 most similar vector to the query
                vector: embeddings,
                includeMetadata: true,
                namespace
            }
        })
        return queryResult.matches || []
    } catch (error) {
        console.log('Error querying embeddings ', error)
        throw error
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

    // Adjust this threshold as needed
    const similarityThreshold = -0.05;
    const qualifyingDocs = matches.filter((match) => match.score && match.score > similarityThreshold);

    type Metadata = {
        text: string,
        pageNumber: number
    }

    let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
    const context = docs.join("\n").substring(0, 2000);
    return context;
}