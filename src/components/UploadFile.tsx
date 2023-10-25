"use client"
import { uploadToS3 } from '@/lib/s3'
import { Inbox, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import {toast} from 'react-hot-toast'


const UploadFile = () => {
  const [uploading, setUploading] = useState(false)
  //mutation is a function that allows you to hit the backend API
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ fileKey, file_name }: { fileKey: string, file_name: string }) => {
      const response = await axios.post('/api/create-chat', { fileKey, file_name })
      return response.data
    }
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles)
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large")
        return
      }
      try {
        setUploading(true)
        const data = await uploadToS3(file)
        if(!data?.fileKey || !data.file_name){
          toast.error("Something went wrong")
          return
        }
        mutate(data, {
          onSuccess: (data)=>{
            console.log(data)
            toast.success(data.message)
          },
          onError: (err) =>{
            toast.error("Error creating chat")
          }
        })
        console.log(data)
      } catch (error) {
        console.log(error)
      } finally {
        setUploading(false)
      }
    }
  })
  return (
    <div className=' bg-blue-400 rounded-xl border-2 border-black'>
      <div {...getRootProps({
        className: " border-dashed border-2 rounded-xl cursor-pointer bg-gray-400 py-12 "
      })} >
        <input {...getInputProps()} />
        {(uploading || isPending)?(<>
        <div className='flex justify-center'>
        <Loader2 className='h-10 w-10 animate-spin' />
        </div>
        <p className='mt-2  text-slate-300 font-medium text-lg'>Spilling tea to GPT...</p>
        </>):(
          <div className='flex justify-center items-center flex-col'>
            <Inbox className='w-10 h-10 ' />
            <p className='mt-2 font-medium text-lg'>Drop Files here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadFile