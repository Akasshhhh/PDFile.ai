"use client";
import { uploadToS3 } from '@/lib/s3'
import { Inbox } from 'lucide-react'
import React from 'react'
import { useDropzone } from 'react-dropzone';


const UploadFile = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log("Accepted files")
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        alert("Please upload a smaller file")
        return
      }
      try {
        const data = await uploadToS3(file)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
  })

  return (
    <div className=' bg-blue-400 rounded-xl border-2 border-black'>
      <div {...getRootProps({
        className: " border-dashed border-2 rounded-xl cursor-pointer bg-gray-400 py-12 "
      })} >
        <input {...getInputProps()} />
        <div className='flex justify-center items-center flex-col'>
          <Inbox className='w-10 h-10 ' />
          <p className='mt-2 font-medium text-lg'>Drop Files here</p>
        </div>
      </div>
    </div>
  )
}

export default UploadFile