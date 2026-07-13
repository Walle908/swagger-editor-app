import { type ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
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

    const result = await LocaleLayout({
      children: <div data-testid="page-content">Main Page Code</div>,
      params: mockParams,
    });

    expect(result.type).toBe('html');
    expect(result.props.lang).toBe('ru');
    expect(result.props.className).toContain('mock-libre-franklin');
    expect(result.props.className).toContain('mock-jetbrains-mono');

    const headElement = result.props.children[0];
    expect(headElement.type).toBe('head');

    const scriptTag = headElement.props.children;
    expect(scriptTag.props.id).toBe('theme-init');
    expect(scriptTag.props.dangerouslySetInnerHTML.__html).toContain(
      "localStorage.getItem('theme-storage')"
    );

    const bodyElement = result.props.children[1];
    expect(bodyElement.type).toBe('body');
    expect(bodyElement.props.className).toBe('layoutContainer');

    const providerElement = bodyElement.props.children;

    const [header, main, footer] = providerElement.props.children;

    expect(header.type).not.toBeNull();
    expect(footer.type).not.toBeNull();

    expect(main.type).toBe('main');
    expect(main.props.className).toBe('mainContent');
    expect(main.props.children.props['data-testid']).toBe('page-content');
  });
});
