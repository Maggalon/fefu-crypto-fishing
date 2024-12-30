import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomMenu from "@/components/bottom-menu";
import { MainProvider } from "@/context/main-context";
// import Script from "next/script";
import WebApp from "@twa-dev/sdk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

WebApp.ready()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainProvider>
          <main className='flex flex-col items-center p-5 mt-5 mb-40'>
            {children}
          </main>
        </MainProvider>
        <BottomMenu />
        {/* <Script src="https://telegram.org/js/telegram-web-app.js" /> */}
      </body>
    </html>
  );
}
