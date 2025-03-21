import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Jersey_15 ,Jersey_10} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";




const jersey10 = Jersey_10({
  weight: "400",
  variable: "--font-jersey",
  subsets: ["latin"],
});
const jersey15 = Jersey_15({
  weight: "400",
  variable: "--font-jersey",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixel Cypher",
  description: "A web app to encrypt and decrypt text in images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jersey15.className} ${jersey10.className} antialiased bg-black`}
      >
        {children}
      </body>
     <Toaster />
    </html>
  );
}
