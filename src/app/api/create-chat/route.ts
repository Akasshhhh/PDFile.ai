// /api/create-chat

import { loadS3IntoPinecone } from "@/lib/pinecone"
import { NextResponse } from "next/server"

export async function POST(req: Request,res: Response) {
    try {
        const body = await req.json()
        const {fileKey,file_name} = body //this will come from UploadFile.tsx data variable
        console.log(fileKey,file_name)
        
        //for pinecone vector embedding
        const pages = await loadS3IntoPinecone(fileKey)
        return NextResponse.json({pages}) 
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {error: "internal server error"},
            {status: 500}
        )
    }
}