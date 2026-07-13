import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import History from './page';
vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<unknown>) => {
    loader();
    return () => <div data-testid="history-page-view" />;
  },
}));

describe('History route', () => {
  it('renders the HistoryPage view', () => {
    render(<History />);
    expect(screen.getByTestId('history-page-view')).toBeInTheDocument();
  });
});
