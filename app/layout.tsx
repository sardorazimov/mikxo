import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/provider/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mikxo | The Social Workspace",
    template: "%s | Mikxo" // Alt sayfalarda "Chat | Mikxo" gibi görünür
  },
  description: "Discord'un gücü, Telegram'ın hızı ve Instagram'ın sosyal dokusu Mikxo'da birleşti. #Hashtag tabanlı yeni nesil iletişim.",
  icons: {
    icon: "/logos.png",
    shortcut: "/logos.png"
     // Logon hazır olduğunda buraya ekleyeceğiz
  },
  openGraph: {
    title: "Mikxo",
    description: "Yeni nesil topluluk ve mesajlaşma platformu.",
    url: "https://mikxo.app",
    siteName: "Mikxo",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressContentEditableWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>

  );
}
