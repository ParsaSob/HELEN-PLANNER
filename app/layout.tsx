import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "پلنر هلن — کنکور تجربی",
  description: "پلنر روزانه و هفتگی مطالعه کنکور تجربی، با محیط سه‌بعدی و درخت پیشرفت",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-vazir min-h-screen">{children}</body>
    </html>
  );
}
