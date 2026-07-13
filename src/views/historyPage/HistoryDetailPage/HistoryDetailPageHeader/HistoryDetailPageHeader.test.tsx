import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistoryDetailPageHeader from './HistoryDetailPageHeader';
import { RequestLog } from '@/types/historyTypes';

vi.mock('@/firebase', () => ({
  db: {},
  auth: {},
}));

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

const log: RequestLog = {
  id: 'log-1',
  userId: 'user-1',
  method: 'POST',
  endpoint: '/pets',
  url: 'https://api.example.com/pets',
  statusCode: 201,
  timestamp: '2026-01-01T00:00:00.000Z',
  errorDetails: null,
};

describe('HistoryDetailPageHeader', () => {
  it('renders the http method and url', () => {
    render(<HistoryDetailPageHeader log={log} />);
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: log.url })).toBeInTheDocument();
  });

  it('exposes the lowercased method as a data attribute for styling', () => {
    render(<HistoryDetailPageHeader log={log} />);
    expect(screen.getByText('POST')).toHaveAttribute('data-method', 'post');
  });
});
