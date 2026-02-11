import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'החללית של קלודוש — 3 מפגשים למערכת הפעלה אישית',
  description: '3 מפגשים תמציתיים שהופכים אותך ממשתמש AI למנהל סוכנים. לא צריך ניסיון בתכנות. ₪297 לסדרה המלאה.',
  openGraph: {
    title: 'החללית של קלודוש',
    description: '3 מפגשים תמציתיים שהופכים אותך ממשתמש AI למנהל סוכנים',
    images: ['/series/poster-v3-series-combined.jpg'],
  },
}

export default function SeriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
