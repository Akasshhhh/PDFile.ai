"use client"

import React, { useEffect } from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import MessageList from './MessageList'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Message } from 'ai'
type Props = {chatId:number}

const ChatComponent = ({chatId}: Props) => {
    const {data} = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () =>{
            const response = await axios.post<Message[]>('/api/get-messages',chatId)
            return response.data
        }
    })
    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api: '/api/chat',
        body: {
            chatId
        },
        initialMessages: data || []
    })

    useEffect(() => {
        const messageContainer = document.getElementById('message-list')
        if (messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [messages])

    return (
        <div className='relative h-screen flex flex-col'>
            <div className='sticky top-0 inset-x-0 bg-white h-fit p-2 shadow-sm'>
                <h3 className='text-xl font-bold'>Chat</h3>
            </div>

            {/* message list */}
            <div className='flex-1 overflow-y-auto pb-4 ' id='message-list'>
                <MessageList messages={messages} />
            </div>

            <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white '>
                <div className='flex'>
                    <Input value={input} onChange={handleInputChange} placeholder='Ask any question?' className='w-full' />
                    <Button className='bg-blue-600 ml-2'>
                        <Send className='h-4 w-4' />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ChatComponent