import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StoreProvider } from "@/context/StoreContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "قطع غيار بلس | المتجر الاحترافي لقطع غيار السيارات والأصلي",
  description: "المتجر الإلكتروني المتخصص في قطع غيار السيارات الأصلية والتجارية الممتازة مع فحص التوافق برقم الشاسي VIN والتوصيل السريع.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased font-sans selection:bg-red-500 selection:text-white" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
