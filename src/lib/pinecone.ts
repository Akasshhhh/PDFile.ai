import {Pinecone, PineconeRecord} from "@pinecone-database/pinecone"
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter} from "@pinecone-database/doc-splitter"
import { getEmbeddings } from "./embeddings";
import md5 from "md5"
import { convertToAscii } from "./utils";
 
//Things we need to do for AI RAG
//1. Obtain the Pdf
//2. Split and segment the pdf
//3. Vectorise and embed individual documents
//4. Store the vectors into pinecone

//Search
//5.Embed the query 
//6.Query the pineconedb for similar vectors
//7.Extract out the metadata for similar vectors
//8.Feed metadata into openAi prompt

let pinecone : Pinecone | null = null;

export const getPineconeClient =async () => {
    if(!pinecone){
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        })
    }
    return pinecone
}

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber: number}
    }
}

export async function loadS3IntoPinecone(fileKey: string){
    //1.obtain the pdf -> download and read the pdf
    console.log("downloading from the s3 to the file system")
    const file_name = await downloadFromS3(fileKey)
    if(!file_name){
        throw new Error("could not download from s3")
    }
    console.log(file_name)
    //1.1.Install and use langchain so that it can read the text inside our pdf file
    const loader = new PDFLoader(file_name)
    const pages = (await loader.load()) as PDFPage[]

    //2. Split and segment the pdf into pages
    const documents = await Promise.all(pages.map(prepareDocuments))

    //3. Vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument))

    //4. Upload to Pinecone
    const client = await getPineconeClient()
    const pineconeIndex = client.Index('pdfile-ai') //Index means DB of pinecone
    const namespace = convertToAscii(fileKey)
    console.log("Inserting vectors into pinecone")
    // pineconeIndex.upsert(vectors)
    await pineconeIndex.namespace(namespace).upsert(vectors)
    return documents[0]
}

async function embedDocument(doc: Document){
    try {
        const embedding = await getEmbeddings(doc.pageContent)
        //To make sure we can id the vector within pinecone we use hash (md5 package)
        const hash = md5(doc.pageContent)

        return {
            values: embedding,
            id: hash,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as PineconeRecord
    } catch (error) {
        console.log("error embedding document",error)
        throw error
    }
}

export const truncateStringBytes = (str: string, bytes: number) =>{
    const enc = new TextEncoder()
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}

export async function prepareDocuments(page: PDFPage){
    let {pageContent, metadata} = page
    pageContent = pageContent.replace(/\n/g, '')//regex to replace all the new line characters with the empty string
    //split the doc and segment it into smaller chunks
    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pagenumber: metadata.loc.pageNumber,
                //it could be very large for pinecone to vectorise so we make another function so it does it within the range of it
                text: truncateStringBytes(pageContent,36000)
            }
        })
    ])
    return docs
}