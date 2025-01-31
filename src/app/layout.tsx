import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import ProviderQuery from "@/components/home/ProviderQuery";
import ProviderHome from "@/components/home/ProviderHome";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Felifoodie | Proyecto realizado por Jose Feliciano",
  description: "Felifoodie creado con Next.js",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ProviderQuery>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ProviderHome>
            {children}
            {modal}
            <Toaster position="top-right" reverseOrder={false} />
          </ProviderHome>
        </body>
      </ProviderQuery>
    </html>
  );
}
