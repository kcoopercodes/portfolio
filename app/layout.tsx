import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Domine, Open_Sans } from 'next/font/google'
import { SiteShell } from '@/components/site-shell'
import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

const domine = Domine({
  subsets: ['latin'],
  variable: '--font-domine',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Khalif Cooper",
    template: "%s · Khalif Cooper",
  },
  description:
    "I help everyday people use AI to build practical skills, advance their careers, grow businesses, and unlock new opportunities.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`light bg-background ${openSans.variable} ${domine.variable}`}
    >
      <body className="antialiased font-sans">
        <SiteShell>{children}</SiteShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
