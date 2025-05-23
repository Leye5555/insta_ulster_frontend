import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalContextProvider } from "@/services/context/context";
import ProviderComp from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import "react-comments-section/dist/index.css";

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
  title: "Insta Ulster",
  description: "A highly scalable photo sharing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden w-full`}
      >
        <ProviderComp>
          <Toaster />
          <GlobalContextProvider>{children}</GlobalContextProvider>
        </ProviderComp>
      </body>
    </html>
  );
}
