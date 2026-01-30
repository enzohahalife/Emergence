import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'),
  title: {
    default: "涌现阅览室",
    template: "%s | 涌现阅览室",
  },
  description: "知识止步于此，行动始于涌现",
  keywords: ['涌现阅览室', '涌现', 'yxlab', '阅览室'],
  authors: [{ name: '涌现阅览室' }],
  creator: '涌现阅览室',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com',
    siteName: '涌现阅览室',
    title: '涌现阅览室',
    description: '知识止步于此，行动始于涌现',
  },
  twitter: {
    card: 'summary_large_image',
    creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@your_twitter',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${merriweather.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
