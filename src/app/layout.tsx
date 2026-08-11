import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ابزارک - ابزارهای آنلاین رایگان",
  description: "مجموعه ابزارهای آنلاین رایگان شامل ماشین حساب علمی، تقویم شمسی، هواشناسی، ابزارهای شبکه و بیش از ۶۰ ابزار کاربردی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('abzarak-theme');
                  if (t === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
