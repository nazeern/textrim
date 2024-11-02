import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

const lato = Lato({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SimpleClip",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.className} text-[17px]`}>
      <body>
        <NextTopLoader color="#0345fc" height={6} />
        {children}
      </body>
    </html>
  );
}
