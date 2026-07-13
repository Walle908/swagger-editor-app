import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DecorPanel from './DecorPanel';
import styles from './DecorPanel.module.scss';

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
    as?: 'h1' | 'h2' | 'p' | 'span';
    color?: string;
    size?: string;
    weight?: string;
    className?: string;
  }) => <Tag className={className}>{children}</Tag>,
}));

describe('DecorPanel Component', () => {
  it('should render container layouts with correct style class', () => {
    const { container } = render(<DecorPanel />);

    const rootContainer = container.querySelector(`.${styles.container}`);
    expect(rootContainer).toBeInTheDocument();

    const textContainer = container.querySelector(`.${styles.textContainer}`);
    expect(textContainer).toBeInTheDocument();
  });

  it('should render title and subtitle elements with translated keys', () => {
    render(<DecorPanel />);

    const titleElement = screen.getByRole('heading', { level: 2, name: 'title' });
    expect(titleElement).toBeInTheDocument();

    const subtitleElement = screen.getByText('subtitle');
    expect(subtitleElement).toBeInTheDocument();
  });
});
