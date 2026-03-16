import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import ScrollToTop from '@/components/ScrollToTop'
import Nav from '@/components/Nav'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kulaire | Creative Studio',
  description: 'Motion graphics, video editing, and web development for artists, brands, and businesses that want to stand out.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans bg-bg text-ink">
        <div id="site-root">
          <ScrollToTop />
          <Nav />
          {children}
        </div>
      </body>
    </html>
  )
}
