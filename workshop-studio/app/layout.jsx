import "./globals.css";

export const metadata = {
  title: "AVIZ Workshop Studio",
  description: "Dynamic workshop management app for AVIZ"
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
