import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KeyStone',
  description: 'On-Chain Proof and Agreement Registry',
  generator: 'BUI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
