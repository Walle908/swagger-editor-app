import { type ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import LocaleLayout, { generateStaticParams } from './layout';

vi.mock('next/font/google', () => ({
  Libre_Franklin: () => ({ variable: 'mock-libre-franklin' }),
  JetBrains_Mono: () => ({ variable: 'mock-jetbrains-mono' }),
}));

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

vi.mock('next/script', () => ({
  default: ({
    dangerouslySetInnerHTML,
    id,
  }: {
    dangerouslySetInnerHTML: { __html: string };
    id: string;
  }) => <script id={id} dangerouslySetInnerHTML={dangerouslySetInnerHTML} />,
}));

describe('LocaleLayout (Server Component)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.removeAttribute('lang');
    document.documentElement.className = '';

    const oldScript = document.getElementById('theme-init');
    if (oldScript) oldScript.remove();
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

    expect(document.documentElement).toHaveAttribute('lang', 'ru');
    expect(document.documentElement.className).toContain('mock-libre-franklin');
    expect(document.documentElement.className).toContain('mock-jetbrains-mono');

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();

    const scriptTag = document.getElementById('theme-init') as HTMLScriptElement | null;
    expect(scriptTag).toBeInTheDocument();
    expect(scriptTag).not.toBeNull();
    expect(scriptTag?.innerHTML).toContain("localStorage.getItem('theme-storage')");
  });
});
