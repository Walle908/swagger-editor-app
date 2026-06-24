import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Swagger editor app',
  description:
    'App allows users to edit and test APIs using OpenAPI specifications in an accessible, user-friendly interface.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
