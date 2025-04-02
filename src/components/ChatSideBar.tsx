'use client'

import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { MessageCircle, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import SubscriptionButton from './SubscriptionButton'
type Props = {
    chats: DrizzleChat[],
    chatId: number,
    isPro: boolean
}

const ChatSideBar = ({chats, chatId, isPro}: Props) => {
  return (
    <div className='w-full h-screen p-4 text-gray-200 bg-gray-900 flex flex-col'>
        <Link href='/'>
            <Button className='w-full border-dashed border-white border'>
                <PlusCircle className='mr-2 w-4 h-4' />
                New Chat
            </Button>
        </Link>

        <div className='flex-1 overflow-y-auto mt-4'>
            <div className='flex flex-col gap-2'>
                {chats.map(chat => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div className={cn('rounded-lg p-3 text-slate-300 flex items-center',{
                            'bg-blue-500 text-white' : String(chat.id) === String(chatId),
                            'hover:text-white' : chat.id !== chatId
                        })}>
                            <MessageCircle className='mr-2' />
                            <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>{chat.pdfName}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        <div className='mt-auto pt-4'>
            <div className='flex flex-col gap-2'>
                <div className='w-full'>
                    <SubscriptionButton isPro={isPro} className="w-full text-center border border-gray-700 bg-blue-700" />
                </div>
                <Link 
                    href={'/'} 
                    className='w-full text-center bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors'
                >
                    Home
                </Link>
            </div>
        </div>
    </div>

  )
}

export default ChatSideBar