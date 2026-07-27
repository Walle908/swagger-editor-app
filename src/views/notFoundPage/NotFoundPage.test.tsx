import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFoundPage from './NotFoundPage';
import styles from './NotFoundPage.module.scss';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui', () => ({
  Text: ({
    children,
    as: Tag = 'span',
    className,
  }: {
    children: ReactNode;
    as?: 'h1' | 'span';
    color?: string;
    size?: string;
    weight?: string;
    className?: string;
  }) => <Tag className={className}>{children}</Tag>,
  LinkComponent: ({
    children,
    href,
    className,
  }: {
    children: ReactNode;
    href: string;
    className?: string;
    variant?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('NotFoundPage Component', () => {
  it('should render page container with correct style class', () => {
    const { container } = render(<NotFoundPage />);

    const rootContainer = container.querySelector(`.${styles.notFoundContainer}`);
    expect(rootContainer).toBeInTheDocument();
  });

  it('should render title, 404 message and home link with proper translations', () => {
    render(<NotFoundPage />);

    const titleElement = screen.getByText('title');
    expect(titleElement).toBeInTheDocument();

    const messageHeading = screen.getByRole('heading', { level: 1, name: 'message' });
    expect(messageHeading).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: 'link' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink.className).toContain('colorfull');
  });
});
