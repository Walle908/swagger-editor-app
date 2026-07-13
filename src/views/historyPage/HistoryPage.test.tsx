import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState, useEffect, type ComponentType } from 'react';
import HistoryPage from './HistoryPage';
import { RequestLog, HistorySummary } from '@/types/historyTypes';

const cookiesMock = vi.fn();
const redirectMock = vi.fn();
const getRequestLogsForUserMock = vi.fn();

vi.mock('next/headers', () => ({
  cookies: () => cookiesMock(),
}));

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => redirectMock(...args),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}));

vi.mock('@/firebase', () => ({
  db: {},
  auth: {},
}));

vi.mock('@/utils/historyUtils', async () => {
  const actual =
    await vi.importActual<typeof import('@/utils/historyUtils')>('@/utils/historyUtils');
  return {
    ...actual,
    getRequestLogsForUser: (...args: unknown[]) => getRequestLogsForUserMock(...args),
  };
});

vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<{ default: ComponentType<Record<string, unknown>> }>) => {
    const LazyComponent = (props: Record<string, unknown>) => {
      const [Comp, setComp] = useState<ComponentType<Record<string, unknown>> | null>(null);
      useEffect(() => {
        let mounted = true;
        loader().then((mod) => {
          if (mounted) setComp(() => mod.default);
        });
        return () => {
          mounted = false;
        };
      }, []);
      return Comp ? <Comp {...props} /> : null;
    };
    return LazyComponent;
  },
}));

vi.mock('@/components/history/HistoryTable/HistoryTable', () => ({
  default: ({ logs }: { logs: RequestLog[] }) => (
    <div data-testid="history-table">{logs.length} rows</div>
  ),
}));

vi.mock('@/components/history/HistoryCards/HistoryCards', () => ({
  default: ({ summary }: { summary: HistorySummary }) => (
    <div data-testid="history-cards">{summary.total} total</div>
  ),
}));

vi.mock('@/components/history/HistoryTable/EmptyHistory/EmptyHistory', () => ({
  default: () => <div data-testid="empty-history" />,
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
  method: 'GET',
  endpoint: '/pets',
  url: 'https://api.example.com/pets',
  statusCode: 200,
  durationMs: 100,
  timestamp: '2026-01-01T00:00:00.000Z',
  errorDetails: null,
};

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirectMock.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });
  });

  it('redirects to the main page when there is no uid cookie', async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined });

    await expect(HistoryPage()).rejects.toThrow('NEXT_REDIRECT');

    expect(redirectMock).toHaveBeenCalledWith('/');
  });

  it('renders the empty state when the user has no logs', async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: 'user-1' }) });
    getRequestLogsForUserMock.mockResolvedValue([]);

    const jsx = await HistoryPage();
    render(jsx);

    expect(await screen.findByTestId('empty-history')).toBeInTheDocument();
  });

  it('renders cards and table when the user has logs', async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: 'user-1' }) });
    getRequestLogsForUserMock.mockResolvedValue([log]);

    const jsx = await HistoryPage();
    render(jsx);

    expect(await screen.findByTestId('history-cards')).toHaveTextContent('1 total');
    expect(await screen.findByTestId('history-table')).toHaveTextContent('1 rows');
  });

  it('shows a load error message when fetching logs fails', async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: 'user-1' }) });
    getRequestLogsForUserMock.mockRejectedValue(new Error('firestore down'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const jsx = await HistoryPage();
    render(jsx);

    expect(screen.getByText('loadError')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-history')).not.toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('renders the page title and subtitle', async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: 'user-1' }) });
    getRequestLogsForUserMock.mockResolvedValue([]);

    const jsx = await HistoryPage();
    render(jsx);

    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument();
    expect(screen.getByText('subtitle')).toBeInTheDocument();
  });
});
