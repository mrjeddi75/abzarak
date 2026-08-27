import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ابزارک - ابزارهای آنلاین رایگان فارسی | بیش از ۶۰ ابزار",
  description:
    "مجموعه کامل ابزارهای آنلاین رایگان فارسی: ماشین حساب، تقویم شمسی، تبدیل تاریخ، هواشناسی، ابزارهای توسعه‌دهندگان، شبکه، محاسبه مالیات حقوق، عیدی و سنوات و بیش از ۶۰ ابزار کاربردی.",
  keywords: [
    "ابزار آنلاین",
    "ماشین حساب",
    "تقویم شمسی",
    "تبدیل تاریخ",
    "هواشناسی ایران",
    "ابزار توسعه‌دهندگان",
    "فرمت JSON",
    "تولید رمز عبور",
    "محاسبه مالیات",
    "عیدی سنوات",
    "تبدیل واحد",
    "ابزار شبکه",
    "استعلام IP",
    "تست سرعت",
    "قیمت طلا",
    "تبدیل رمزارز",
    "ابزارهای آنلاین رایگان",
    "ابزارک",
  ],
  authors: [{ name: "ابزارک" }],
  creator: "ابزارک",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://abzarak.pages.dev",
    title: "ابزارک - ابزارهای آنلاین رایگان فارسی",
    description:
      "بیش از ۶۰ ابزار آنلاین رایگان: ماشین حساب، تقویم شمسی، هواشناسی، ابزارهای برنامه‌نویسی و شبکه.",
    siteName: "ابزارک",
  },
  twitter: {
    card: "summary_large_image",
    title: "ابزارک - ابزارهای آنلاین رایگان فارسی",
    description:
      "بیش از ۶۰ ابزار آنلاین رایگان: ماشین حساب، تقویم شمسی، هواشناسی، ابزارهای برنامه‌نویسی و شبکه.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ابزارک",
    url: "https://abzarak.pages.dev",
    description:
      "مجموعه کامل ابزارهای آنلاین رایگان فارسی با بیش از ۶۰ ابزار کاربردی",
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://abzarak.pages.dev/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="fa" dir="rtl" className="dark">
      <head>
        <link rel="canonical" href="https://abzarak.pages.dev" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
