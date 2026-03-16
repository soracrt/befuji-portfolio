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
  title: 'Kulaire — Built to be remembered.',
  description: 'An elite collective of editors and developers. High-impact motion for artists, performance ads for brands, and minimalist web for SaaS.',
  metadataBase: new URL('https://kulaire.com'),
  alternates: {
    canonical: 'https://kulaire.com',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Kulaire | Motion & Web Studio',
    description: 'Motion and Web designed to be remembered. Elite creative services for brands and creators.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Kulaire Motion Graphics Showcase' }],
    type: 'website',
    url: 'https://kulaire.com',
    siteName: 'Kulaire',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kulaire | Motion & Web Studio',
    description: 'Motion and Web designed to be remembered. Elite creative services for brands and creators.',
    images: ['/og-image.png'],
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
