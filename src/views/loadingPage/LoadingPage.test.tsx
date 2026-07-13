import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingPage from './LoadingPage';
import styles from './LoadingPage.module.scss';

vi.mock('@/components/ui', () => ({
  Loader: () => <div data-testid="mock-loader">Spinner</div>,
}));

describe('LoadingPage Component', () => {
  it('should render loading page container with correct accessibility attributes', () => {
    render(<LoadingPage />);

    const container = screen.getByRole('status');

    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('aria-label', 'Loading');
    expect(container.className).toBe(styles.loadingContainer);
  });

  it('should successfully contain the child Loader component', () => {
    render(<LoadingPage />);

    const loaderElement = screen.getByTestId('mock-loader');
    expect(loaderElement).toBeInTheDocument();
  });
});
