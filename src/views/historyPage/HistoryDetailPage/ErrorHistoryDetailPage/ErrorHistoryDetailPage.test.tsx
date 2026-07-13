import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorHistoryDetailPage from './ErrorHistoryDetailPage';

vi.mock('@/components/ui/logo/Logo', () => ({
  Logo: () => null,
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: { href: unknown; children: React.ReactNode }) => (
    <a href={typeof href === 'string' ? href : String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe('ErrorHistoryDetailPage', () => {
  it('renders the given label and error message', () => {
    render(<ErrorHistoryDetailPage label="Error details" errorMessage="Connection timed out" />);

    expect(screen.getByText('Error details')).toBeInTheDocument();
    expect(screen.getByText('Connection timed out')).toBeInTheDocument();
  });
});
