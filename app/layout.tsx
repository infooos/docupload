import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastProvider } from "@/components/ui/toast"
import { Providers } from "@/components/Providers"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextJS Supabase App',
  description: 'A comprehensive application for managing users, companies, and processes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  )
}