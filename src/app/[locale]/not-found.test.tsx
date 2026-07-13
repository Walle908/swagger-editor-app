import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LocaleNotFound from './not-found';
vi.mock('@/views/notFoundPage/NotFoundPage', () => ({
  default: () => <div data-testid="mock-not-found-page">404 - Page Not Found</div>,
}));

describe('LocaleNotFound Component', () => {
  it('should successfully render the NotFoundPage component', () => {
    render(<LocaleNotFound />);

    const notFoundPage = screen.getByTestId('mock-not-found-page');
    expect(notFoundPage).toBeInTheDocument();
  });
});
