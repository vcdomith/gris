import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/providers";
import GradientComponent from "@/components/Gradient/Gradient";
import AuthButton from "@/components/AuthButton";
import Nav from "@/components/Nav/Nav";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GradientComponent />
        <Providers>
        <div className="flex flex-col justify-center items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
