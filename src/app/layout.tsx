import { type ReactNode } from 'react';
import { Libre_Franklin, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.scss';

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

const themeInit = `
  try {
    const raw = localStorage.getItem('theme');
    const theme = raw ? JSON.parse(raw).state.theme : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch {}
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${libreFranklin.variable} ${jetBrainsMono.variable}`}>
      <head>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="layoutContainer">{children}</body>
    </html>
  );
}
