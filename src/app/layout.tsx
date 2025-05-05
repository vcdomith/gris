import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/providers";
import GradientComponent from "@/components/Gradient/Gradient";
import AuthButton from "@/components/AuthButton";
import Nav from "@/components/Nav/Nav";
import Modal from "@/components/Modal/Modal";
import { Toaster } from "sonner";
import style from './style.module.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gris",
  description: "Groovy in spirit",
};

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${style.global} antialiased selection:bg-[#1124cc] selection:text-amber-50 overflow-x-hidden`}
      >
        <Toaster />
        <GradientComponent />
        <Providers>
        <div className="flex flex-col justify-center items-center justify-items-center min-h-screen p-4 md:p-8 pt-[52px] md:pt-[100px] gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] w-[calc(100dvw)] md:w-[calc(100dvw-1rem)] overflow-x-hidden">
          {/* <AuthButton /> */}
          <Nav />
          <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
            {modal}
            {children}
          </main>
        </div>
        </Providers>
      </body>
    </html>
  );
}
