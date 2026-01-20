import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'הגרלת הסדנה - קלודוש למתחילים',
  description: 'הגרלת 3 Passes לניסיון חינמי',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
