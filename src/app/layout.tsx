import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Link from "next/link";


export const metadata: Metadata = {
  title: 'Farmers-market',
  description: 'farmers marketplace- buy and sell goods',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="antialiased">
          <nav className="bg-white border-b border-[#DAD7C9] px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
          <Link href="/" className="text-xl font-bold text-[#6E8B3D]">FarmerLink</Link>
          <div className="space-x-4 text-sm">
            <Link href="/products" className="hover:underline">Marketplace</Link>
            <Link href="/farmers" className="hover:underline">Farmers</Link>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Sign Up</Link>
          </div>
        </nav>

        {children}
        </body>
    </html>
  );
}