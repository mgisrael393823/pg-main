import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PorterGoldberg MVP',
  description: 'Real Estate Platform',
  openGraph: {
    title: 'PorterGoldberg MVP',
    description: 'Real Estate Platform',
    images: [
      {
        url: '/images/og-sharing-image.webp',
        width: 1200,
        height: 630,
        alt: 'PorterGoldberg Real Estate',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PorterGoldberg MVP',
    description: 'Real Estate Platform',
    images: ['/images/og-sharing-image.webp'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}