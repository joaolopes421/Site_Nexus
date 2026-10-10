// Shell mínimo para a preview do v0, que compila o projeto como Next.js. A app real é a SPA Vite em /src.
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '../src/presentation/styles/index.css'

export const metadata: Metadata = {
  title: 'Nexus System | Gestão Inteligente. Resultados Reais.',
  description:
    'Nexus System: engenharia de software, sistemas ERP e SaaS personalizados, desenvolvimento web, automação de processos, consultoria de TI e infraestrutura de redes.',
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#090D16',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
