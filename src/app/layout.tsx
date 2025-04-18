import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'ChatPDF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body suppressHydrationWarning className={inter.className}>{children}
            <Toaster />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  )
}
