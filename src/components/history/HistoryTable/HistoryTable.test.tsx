import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistoryTable from './HistoryTable';
import { RequestLog } from '@/types/historyTypes';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

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

const logs: RequestLog[] = [
  {
    id: 'log-1',
    userId: 'user-1',
    method: 'GET',
    endpoint: '/pets',
    url: 'https://api.example.com/pets',
    statusCode: 200,
    durationMs: 120,
    requestSize: 512,
    responseSize: 2048,
    timestamp: '2026-01-01T10:00:00.000Z',
    errorDetails: null,
  },
  {
    id: 'log-2',
    userId: 'user-1',
    method: 'POST',
    endpoint: '/pets',
    url: 'https://api.example.com/pets',
    statusCode: 500,
    timestamp: '2026-01-02T10:00:00.000Z',
    errorDetails: 'Internal error',
  },
];

describe('HistoryTable', () => {
  it('renders a header column for every configured column', () => {
    render(<HistoryTable logs={logs} />);

    expect(screen.getByText('method')).toBeInTheDocument();
    expect(screen.getByText('endpoint')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('duration')).toBeInTheDocument();
  });

  it('renders one row per log linking to the history detail route', () => {
    render(<HistoryTable logs={logs} />);

    const rows = screen.getAllByRole('link');
    expect(rows).toHaveLength(logs.length);
    expect(rows[0]).toHaveAttribute('href', '/history/log-1');
    expect(rows[1]).toHaveAttribute('href', '/history/log-2');
  });

  it('displays a placeholder for missing duration values', () => {
    render(<HistoryTable logs={logs} />);

    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });

  it('renders no rows when logs is empty', () => {
    render(<HistoryTable logs={[]} />);

    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
