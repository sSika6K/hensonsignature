import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tim Henson Signature Guitars',
  description: 'Collection des guitares signature de Tim Henson',
}

export default function RootLayout({
  children,
}: {
  children: React.Node
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
