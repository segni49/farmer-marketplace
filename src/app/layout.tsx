import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Providers } from './providers';



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
        <Providers>

          <Navbar />
          {children}
        </Providers>


        </body>
    </html>
  );
}