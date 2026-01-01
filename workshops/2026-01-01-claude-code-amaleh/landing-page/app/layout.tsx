import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'קלוד קוד אמאל׳ה - סדנה',
  description: 'הסדנה שיכולה להיות שווה לך המווווון כסף!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
