import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Swagger editor app',
  description:
    'App allows users to edit and test APIs using OpenAPI specifications in an accessible, user-friendly interface.',
};

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
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
    <html lang="en" className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
