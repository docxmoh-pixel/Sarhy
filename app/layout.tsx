import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { LanguageProvider } from '@/lib/language'
import { CartProvider } from '@/lib/cart'
import { NotificationsProvider } from '@/components/notifications-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'صرحي | Sarhy - منصة الإنتاج الرقمي',
  description: 'منصة عالمية للإنتاج الرقمي والإبداع - سوق رقمي، أدوات ذكاء اصطناعي، اقتصاد المبدعين، التعليم، والمزيد | World-class digital production ecosystem',
  keywords: ['صرحي', 'Sarhy', 'سوق رقمي', 'digital marketplace', 'AI tools', 'creator economy', 'تصميم', 'إنتاج'],
  authors: [{ name: 'Sarhy' }],
  creator: 'Sarhy',
  publisher: 'Sarhy',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    siteName: 'صرحي | Sarhy',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@sarhy',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#122560' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-background" suppressHydrationWarning>
      <body className={`${ibmPlexSansArabic.variable} ${inter.variable} font-sans antialiased overflow-x-hidden`}>
        <LanguageProvider>
          <CartProvider>
            <NotificationsProvider>
              <Navigation />
              {children}
              <Footer />
              <Toaster richColors position="top-center" />
            </NotificationsProvider>
          </CartProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
