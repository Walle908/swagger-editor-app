import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';
import styles from './Logo.module.scss';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
  }: {
    src: string | { src: string; height: number; width: number };
    alt: string;
    priority?: boolean;
    width?: number;
    height?: number;
  }) => {
    const srcPath = typeof src === 'string' ? src : src?.src;
    return <img src={srcPath || ''} alt={alt} />;
  },
}));

vi.mock('..', () => ({
  LinkComponent: ({
    children,
    className,
    href,
  }: {
    children: ReactNode;
    className?: string;
    href: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  Text: ({
    children,
    as: Tag = 'span',
  }: {
    children: ReactNode;
    as?: 'h1' | 'span' | 'p';
    weight?: string;
  }) => <Tag>{children}</Tag>,
}));

describe('Logo Component', () => {
  it('should render successfully with a link to the home page', () => {
    render(<Logo />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/');
    expect(linkElement.className).toContain(styles.logoContainer);
  });

  it('should contain the application branding text', () => {
    render(<Logo />);

    const titleElement = screen.getByRole('heading', { level: 1, name: /openapi studio/i });
    expect(titleElement).toBeInTheDocument();
  });

  it('should render the logo image with proper alternative text', () => {
    render(<Logo />);

    const imageElement = screen.getByRole('img', { name: /swagger editor app logo/i });
    expect(imageElement).toBeInTheDocument();

    expect(imageElement).toHaveAttribute('src');
    expect(imageElement.getAttribute('src')).toContain('logo.svg');
  });
});
