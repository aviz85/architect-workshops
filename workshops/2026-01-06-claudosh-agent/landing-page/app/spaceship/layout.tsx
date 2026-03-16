import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'סידרת קלודוש — מאפס לצבא סוכנים | AVIZ',
  description: '4 מפגשים מעשיים שבהם אתה בונה מערכת סוכני AI שעובדת בשבילך 24/7. בלי לכתוב שורת קוד אחת. ₪500 לסדרה המלאה.',
  openGraph: {
    title: 'סידרת קלודוש — מאפס לצבא סוכנים',
    description: '4 מפגשים מעשיים שבהם אתה בונה מערכת סוכני AI שעובדת בשבילך 24/7',
  },
}

export default function SeriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
