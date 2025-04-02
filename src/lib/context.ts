import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    // Create Pinecone client with direct initialization
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
    });
    
    // Get the index directly
    const index = pinecone.Index('pdfile-ai');
    
    // Convert fileKey to ASCII for namespace
    const namespace = convertToAscii(fileKey);

    try {
        // Using the namespace method as shown in latest docs
        const queryResult = await index.namespace(namespace).query({
            vector: embeddings,
            topK: 5, //returns the 5 most similar vector to the query
            includeMetadata: true
        });
        
        return queryResult.matches || [];
    } catch (error) {
        console.log('Error querying embeddings ', error);
        throw error;
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