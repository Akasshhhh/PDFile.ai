import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { ArrowRight, LogInIcon } from "lucide-react";
import UploadFile from "@/components/UploadFile";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const Home = async () => {
  const { userId } = await auth();
  const isAuth = !!userId; //the double negation operator is used to convert the userId variable to boolean value
  const isPro = await checkSubscription()
  let firstChat;
  if(userId){
    firstChat = await db.select().from(chats).where(eq(chats.userId,userId))
    if(firstChat)
      firstChat = firstChat[0]
  }
  return (
    <div className=" w-screen min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">

            <h1 className="text-5xl font-semibold text-gray-300 mr-3">
              Chat with any PDF
            </h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex mt-2">
            {isAuth && firstChat &&
            <Link href={`/chat/${firstChat.id}`}>
             <Button>Go to Chats <ArrowRight className="ml-2 w-4 h-4" /> </Button>
            </Link>}
            <div className="ml-3"><SubscriptionButton isPro={isPro} /></div>
          </div>

          <p className="max-w-2xl mt-1 text-lg text-slate-500">
            AI-powered PDF chat app that allows you to have natural
            conversations with your PDFs, making it easier than ever to find the
            information you need.
          </p>

          <div className="w-full mt-4">
            {
              isAuth ? (<UploadFile />) : (<Link href="/sign-in">
                <Button className=" text-slate-200">
                  Login to get Started!
                  <LogInIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
