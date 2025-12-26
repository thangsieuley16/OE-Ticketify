import type { Metadata } from "next";

import { Roboto, Tektur, IBM_Plex_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const chatime = localFont({
  src: "../../fonts/chatime.otf",
  variable: "--font-chatime",
});

const inter = localFont({
  src: [
    {
      path: "../../fonts/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../../fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-inter",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
});

const tektur = Tektur({
  subsets: ["latin", "vietnamese"],
  variable: "--font-tektur",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Owniverse 2025 - Year End Party",
  description: "Đêm tiệc vinh danh hoành tráng nhất thập kỷ của Ownego",
  applicationName: 'Owniverse 2025',
  metadataBase: new URL('https://owniverse25.ownego.com'),
  openGraph: {
    title: "Owniverse 2025 - Year End Party",
    description: "Đêm tiệc vinh danh hoành tráng nhất thập kỷ của Ownego",
    url: 'https://owniverse25.ownego.com',
    siteName: 'Owniverse 2025',
    images: [
      {
        url: '/images/cover.png',
        width: 1200,
        height: 630,
        alt: 'Owniverse 2025 Cover',
        type: 'image/png',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  icons: {
    icon: '/images/ownego-icon.png',
    apple: '/images/ownego-icon.png',
  },
  appleWebApp: {
    title: 'Owniverse 2025',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${chatime.variable} ${inter.variable} ${roboto.variable} ${tektur.variable} ${ibmPlexSans.variable} antialiased bg-deep-space text-white min-h-screen flex flex-col font-sans`}
      >
        <Header />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
