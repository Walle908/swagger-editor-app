import { type ReactNode } from 'react';
import type { Metadata } from 'next';
import { Libre_Franklin, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${libreFranklin.variable} ${jetBrainsMono.variable}`}>
      <body className="layoutContainer">
        <NextIntlClientProvider>
          <Header />
          <main className="mainContent">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
