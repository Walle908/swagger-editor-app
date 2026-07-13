import { type ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPage from './ErrorPage';
import styles from './ErrorPage.module.scss';

vi.mock('@/components/ui', () => ({
  Text: ({
    children,
    as: Tag = 'span',
  }: {
    children: ReactNode;
    as?: 'h2' | 'span';
    color?: string;
    size?: string;
  }) => <Tag>{children}</Tag>,
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

describe('ErrorPage Component', () => {
  const mockRetry = vi.fn();
  const mockError = new Error('Test application crash') as Error & { digest?: string };
  mockError.digest = 'digest_123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render error messages and retry text properly', () => {
    render(
      <ErrorPage
        error={mockError}
        unstable_retry={mockRetry}
        errorMessage="Что-то пошло не так"
        retryText="Попробовать снова"
      />
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Что-то пошло не так' });
    expect(heading).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Попробовать снова' });
    expect(button).toBeInTheDocument();
    expect(button.className).toBe(styles.resetButton);

    const container = screen.getByTestId('error-container');
    expect(container.className).toBe(styles.errorContainer);
  });

  it('should trigger unstable_retry callback when action button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ErrorPage
        error={mockError}
        unstable_retry={mockRetry}
        errorMessage="Ошибка"
        retryText="Повторить"
      />
    );

    const button = screen.getByRole('button', { name: 'Повторить' });

    await user.click(button);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
