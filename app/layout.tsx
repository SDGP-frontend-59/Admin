import type { Metadata } from "next";
import { Inter, Roboto_Mono } from 'next/font/google';
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ['latin'] });
const robotoMono = Roboto_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "CeylonMine Admin",
  description: "CeylonMine Admin portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
