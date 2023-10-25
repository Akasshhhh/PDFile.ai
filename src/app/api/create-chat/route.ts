// /api/create-chat

import { NextResponse } from "next/server"

export async function POST(req: Request,res: Response) {
    try {
        const body = await req.json()
        const {fileKey,file_name} = body //this will come from UploadFile.tsx data variable
        //for pinecone vector embedding
        return NextResponse.json({message: "success"}) 
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {error: "internal server error"},
            {status: 500}
        )
    }
}