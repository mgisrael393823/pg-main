import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const sora = Sora({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: 'PorterGoldberg MVP - Real Estate Platform',
  description: 'Reduce agent prospecting time from 30+ minutes to <10 minutes through unified data and intelligent alerts.',
  keywords: ['real estate', 'property management', 'contact management', 'hubspot', 'propstream'],
  authors: [{ name: 'PorterGoldberg Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#151515',
  robots: 'index, follow',
  openGraph: {
    title: 'PorterGoldberg MVP - Real Estate Platform',
    description: 'Unified real estate platform for agents',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.portergoldberg.com',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PorterGoldberg MVP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PorterGoldberg MVP - Real Estate Platform',
    description: 'Unified real estate platform for agents',
    images: ['/images/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${sora.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}