import './globals.css'

import type { Metadata } from 'next'
import { Inter, Roboto } from 'next/font/google'

import { ThemeProvider } from '@/components/ui/theme-provider'
import { ClientProviderLayout } from '@/layouts/ClientProvider'
import { GenericLayout } from '@/layouts/Generic'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-title',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Controle de Estoque',
  description: 'Controle de Estoque para UNIUBE',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GenericLayout>
            <ClientProviderLayout>{children}</ClientProviderLayout>
          </GenericLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
