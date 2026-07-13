import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from './loading';

vi.mock('@/views/loadingPage/LoadingPage', () => ({
  default: () => <div data-testid="mock-loading-page">Loading...</div>,
}));

describe('Loading Component', () => {
  it('should successfully render the LoadingPage component', () => {
    render(<Loading />);

    const loadingPage = screen.getByTestId('mock-loading-page');
    expect(loadingPage).toBeInTheDocument();
  });
});
