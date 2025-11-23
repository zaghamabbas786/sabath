import type { Metadata } from 'next'
import { Cormorant_Garamond, Quicksand } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
})

const quicksand = Quicksand({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Sabbath Health',
  description: 'Jesus-Centered Healing - Understand your emotions. Heal your heart. Invite Christ into the wound.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${cormorantGaramond.variable} ${quicksand.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}

