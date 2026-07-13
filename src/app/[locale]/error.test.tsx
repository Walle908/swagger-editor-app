import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorComponent from './error';

vi.mock('next-intl', () => ({
  useTranslations: () => {
    return (key: string) => `translated_${key}`;
  },
}));

vi.mock('@/views/errorPage/ErrorPage', () => ({
  default: ({ errorMessage, retryText }: { errorMessage: string; retryText: string }) => (
    <div data-testid="mock-error-page">
      <span data-testid="error-msg">{errorMessage}</span>
      <span data-testid="retry-txt">{retryText}</span>
    </div>
  ),
}));

describe('Error Component (Client-side)', () => {
  const mockRetry = vi.fn();
  const mockError = new Error('Client-side crash') as Error & { digest?: string };
  mockError.digest = 'digest_client_456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully pass translated text and props to the ErrorPage view', () => {
    render(<ErrorComponent error={mockError} unstable_retry={mockRetry} />);

    expect(screen.getByTestId('mock-error-page')).toBeInTheDocument();

    const errorMsg = screen.getByTestId('error-msg');
    expect(errorMsg).toHaveTextContent('translated_message');

    const retryTxt = screen.getByTestId('retry-txt');
    expect(retryTxt).toHaveTextContent('translated_retry');
  });
});
