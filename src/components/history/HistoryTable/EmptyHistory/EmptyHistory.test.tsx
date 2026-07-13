import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import EmptyHistory from './EmptyHistory';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui/logo/Logo', () => ({
  Logo: () => null,
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) => (
    <a href={typeof href === 'string' ? href : String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe('EmptyHistory', () => {
  it('renders the informational title and text', () => {
    render(<EmptyHistory />);

    expect(screen.getByRole('heading', { level: 2, name: 'title' })).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('renders links to the editor and viewer', () => {
    render(<EmptyHistory />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    links.forEach((link) => expect(link).toHaveAttribute('href', '/'));
    expect(screen.getByText('openEditor')).toBeInTheDocument();
    expect(screen.getByText('browseViewer')).toBeInTheDocument();
  });
});
