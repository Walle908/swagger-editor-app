import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import styles from './Footer.module.scss';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    priority?: boolean;
    width?: number;
    height?: number;
  }) => {
    return <img src={src} alt={alt} width={width} height={height} />;
  },
}));

vi.mock('@/components/ui', () => ({
  LinkComponent: ({
    children,
    href,
    target,
    rel,
  }: {
    children: ReactNode;
    href: string;
    target?: string;
    rel?: string;
  }) => (
    <a href={href} target={target} rel={rel}>
      {children}
    </a>
  ),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('Footer Component', () => {
  it('should render the footer layout with correct style class', () => {
    render(<Footer />);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement.className).toBe(styles.footer);
  });

  it('should render RS School logo link with proper attributes', () => {
    render(<Footer />);

    const rsLink = screen.getByRole('link', { name: /rs school/i });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/');
    expect(rsLink).toHaveAttribute('target', '_blank');
    expect(rsLink).toHaveAttribute('rel', 'noreferrer');

    const img = screen.getByRole('img', { name: /rs school/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/rss-logo.svg');
    expect(img).toHaveAttribute('width', '40');
    expect(img).toHaveAttribute('height', '40');
  });

  it('should render GitHub repository link with copyright text', () => {
    render(<Footer />);

    const githubLink = screen.getByRole('link', { name: /© 2026 openapi studio/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Walle908/swagger-editor-app');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('should render internal link to About page with translations', () => {
    render(<Footer />);

    const aboutLink = screen.getByRole('link', { name: 'about' });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(aboutLink).not.toHaveAttribute('target');
  });
});
