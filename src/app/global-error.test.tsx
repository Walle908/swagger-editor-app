import { describe, expect, it, vi } from 'vitest';
import GlobalErrorPage from './global-error';

vi.mock('@/views/errorPage/ErrorPage', () => ({
  default: vi.fn(() => null),
}));

describe('GlobalErrorPage Component', () => {
  const mockRetry = vi.fn();
  const mockError = new Error('Global application crash');

  it('should successfully pass specific bilingual text and props to the ErrorPage view', () => {
    const result = GlobalErrorPage({ error: mockError, unstable_retry: mockRetry });

    const bodyProps = result.props.children;
    const errorPageElement = bodyProps.props.children;

    expect(errorPageElement.props.errorMessage).toBe(
      'Something went wrong... / Что-то пошло не так...'
    );
    expect(errorPageElement.props.retryText).toBe('Try again / Повторить попытку');
    expect(errorPageElement.props.error).toBe(mockError);
    expect(errorPageElement.props.unstable_retry).toBe(mockRetry);
  });
});
