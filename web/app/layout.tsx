import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { site } from '@/site.config';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: `${site.businessName} — Flooring sales and installation`,
  description: `Carpet, hardwood, luxury vinyl and tile, sold and installed by ${site.ownerName}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
