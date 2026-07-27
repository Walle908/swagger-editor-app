import { type ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Swagger editor app',
  description:
    'App allows users to edit and test APIs using OpenAPI specifications in an accessible, user-friendly interface.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <Header />
      <main className="mainContent">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
