import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlobalErrorPage from './global-error';

vi.mock('@/views/errorPage/ErrorPage', () => ({
  default: ({
    errorMessage,
    retryText,
  }: {
    errorMessage: string;
    retryText: string;
    error: unknown;
    unstable_retry: () => void;
  }) => (
    <div data-testid="mock-error-page">
      <span data-testid="error-msg">{errorMessage}</span>
      <span data-testid="retry-txt">{retryText}</span>
    </div>
  ),
}));

describe('GlobalErrorPage Component', () => {
  const mockRetry = vi.fn();
  const mockError = new Error('Global application crash') as Error & { digest?: string };
  mockError.digest = 'digest_global_123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully pass specific bilingual text and props to the ErrorPage view', () => {
    render(<GlobalErrorPage error={mockError} unstable_retry={mockRetry} />);

    expect(screen.getByTestId('mock-error-page')).toBeInTheDocument();

    const errorMsg = screen.getByTestId('error-msg');
    expect(errorMsg).toHaveTextContent('Something went wrong... / Что-то пошло не так...');

    const retryTxt = screen.getByTestId('retry-txt');
    expect(retryTxt).toHaveTextContent('Try again / Повторить попытку');
  });
});
