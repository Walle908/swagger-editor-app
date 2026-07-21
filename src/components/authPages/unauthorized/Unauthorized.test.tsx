import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UnauthorizedPage from './Unauthorized';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui', () => ({
  Text: ({
    children,
    as: Tag = 'p',
    color,
    size,
    weight,
    font,
    className,
    ...props
  }: {
    children: ReactNode;
    as?: 'h1' | 'p';
    className?: string;
    size?: string;
    color?: string;
    weight?: string;
    font?: string;
  }) => {
    return (
      <Tag
        data-testid="mock-text"
        data-color={color}
        data-size={size}
        data-weight={weight}
        data-font={font}
        className={className}
        {...props}>
        {children}
      </Tag>
    );
  },
}));

describe('UnauthorizedPage Component', () => {
  it('should render the page structure and localization keys', () => {
    render(<UnauthorizedPage />);

    const errorHeading = screen.getByRole('heading', { level: 1 });
    expect(errorHeading).toBeInTheDocument();
    expect(errorHeading).toHaveTextContent('error');

    expect(errorHeading).toHaveAttribute('data-color', 'error');

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('message')).toBeInTheDocument();
  });
});
