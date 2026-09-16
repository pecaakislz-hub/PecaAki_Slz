import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

export const metadata: Metadata = {
  title: 'PeçaAki - Cotação de Autopeças e Motopeças na Grande São Luís',
  description: 'O marketplace reverso de peças de carros e motos na Grande São Luís (São Luís, Paço do Lumiar, São José de Ribamar e Raposa). Receba orçamentos de lojistas locais em minutos.',
  manifest: '/manifest.webmanifest',
  themeColor: '#0f172a',
  viewport: 'width-device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <PWAInstallPrompt />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
