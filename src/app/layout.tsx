import { type ReactNode } from 'react';
import type { Metadata } from 'next';
import { Libre_Franklin, JetBrains_Mono } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Swagger editor app',
  description:
    'App allows users to edit and test APIs using OpenAPI specifications in an accessible, user-friendly interface.',
};

const libreFranklin = Libre_Franklin({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-libre-franklin',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${libreFranklin.variable} ${jetBrainsMono.variable}`}>
      <body className="layoutContainer">
        <Header />
        <main className="mainContent">{children}</main>
        <p>ваавав</p>
        <Footer />
      </body>
    </html>
  );
}
