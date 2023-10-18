import {integer, pgEnum, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum',['system','user']) //made this for role column in messages table if the role is system that means the message is being sent by GPT

//We are going to make a table for chat

export const chats = pgTable('chats',{
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userId: varchar('user_id', {length:256}).notNull(),//clerk userId
    fileKey: text('file_key').notNull()//when we are retrieving the file from S3
})

export const messages = pgTable('messages',{
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(()=>chats.id /*this is a callback function*/).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    role:userSystemEnum('role').notNull()
})

//drizzle-orm is used to interact with our database
//drizzle-kit gives us utility functions and to make sure that all the database is synced up with schema here 