import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Annfresh — Premium Salads',
  description: 'Fresh, bold salads crafted for your lifestyle. Daily, weekly and monthly plans available.',
  keywords: 'salad, fresh, healthy, delivery, Annfresh',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
