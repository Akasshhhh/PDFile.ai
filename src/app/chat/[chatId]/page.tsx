import ChatComponent from '@/components/ChatComponent'
import ChatSideBar from '@/components/ChatSideBar'
import PDFViewer from '@/components/PDFViewer'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { checkSubscription } from '@/lib/subscription'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: {
        chatId: string
    }
}

const ChatPage = async ({ params: { chatId } }: Props) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect('/sign-in');
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
    // Check if chats are empty
    if (_chats.length === 0) {
        return redirect('/');
    }

    // Ensure the chatId exists in user's chats
    if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
        return redirect('/');
    }

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId))
    const isPro = await checkSubscription()
    return (
        <div>
            <div className='flex max-h-screen overflow-auto'>
                <div className='w-full flex max-h-screen overflow-auto'>
                    {/* Chat sidebar */}
                    <div className='flex-[1] max-w-xs'>
                        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
                    </div>
                    {/* PDF Viewer */}
                    <div className='max-h-screen p-4 overflow-scroll flex-[5]'>
                        <PDFViewer pdf_url={currentChat?.pdfUrl as string || ''} />
                    </div>
                    {/* Chat component */}
                    <div className='flex-[3] border-l-4 border-l-slate-200'>
                        <ChatComponent chatId={parseInt(chatId)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
