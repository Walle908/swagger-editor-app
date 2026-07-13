import { type ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import LocaleLayout, { generateStaticParams } from './layout';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  hasLocale: (_locales: string[], locale: string) => locale === 'en' || locale === 'ru',
}));

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'ru'],
  },
}));

vi.mock('@/components/layout', () => ({
  Header: () => <header data-testid="mock-header">Header</header>,
  Footer: () => <footer data-testid="mock-footer">Footer</footer>,
}));

describe('LocaleLayout (Server Component)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct static parameters mapping for locales generation', () => {
    const params = generateStaticParams();
    expect(params).toEqual([{ locale: 'en' }, { locale: 'ru' }]);
  });

  it('should trigger notFound boundary if route locale parameter is unsupported', async () => {
    const mockParams = Promise.resolve({ locale: 'fr' });

    await LocaleLayout({
      children: <div />,
      params: mockParams,
    });

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('should render main structures properly when locale parameter is valid', async () => {
    const mockParams = Promise.resolve({ locale: 'ru' });

    const ResultingHtml = await LocaleLayout({
      children: <div data-testid="page-content">Main Page Code</div>,
      params: mockParams,
    });

    render(ResultingHtml);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('mainContent');
    expect(mainElement).toContainElement(screen.getByTestId('page-content'));
  });
});
