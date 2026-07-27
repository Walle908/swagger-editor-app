import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import HistoryDetailPage from './HistoryDetailPage';
import { RequestLog } from '@/types/historyTypes';

const cookiesMock = vi.fn();
const redirectMock = vi.fn();
const notFoundMock = vi.fn();
const getRequestLogByIdMock = vi.fn();

vi.mock('next/headers', () => ({
  cookies: () => cookiesMock(),
}));

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => redirectMock(...args),
  notFound: (...args: unknown[]) => notFoundMock(...args),
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
    getRequestLogById: (...args: unknown[]) => getRequestLogByIdMock(...args),
  };
});

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) => (
    <a href={typeof href === 'string' ? href : String(href)} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/ui/logo/Logo', () => ({
  Logo: () => null,
}));

const log: RequestLog = {
  id: 'log-1',
  userId: 'user-1',
  method: 'GET',
  endpoint: '/pets',
  url: 'https://api.example.com/pets',
  statusCode: 200,
  durationMs: 120,
  requestSize: 100,
  responseSize: 200,
  timestamp: '2026-01-01T00:00:00.000Z',
  errorDetails: null,
};

describe('HistoryDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirectMock.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });
    notFoundMock.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
    });
  });

  it('triggers notFound when there is no uid cookie', async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined });

    await expect(HistoryDetailPage({ id: 'log-1' })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
    expect(getRequestLogByIdMock).not.toHaveBeenCalled();
  });

  it('triggers notFound when the log does not exist', async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: 'user-1' }) });
    getRequestLogByIdMock.mockResolvedValue(null);

    await expect(HistoryDetailPage({ id: 'missing' })).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFoundMock).toHaveBeenCalled();
  });

  it('renders log details, a back link and the field grid when the log exists', async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: 'user-1' }) });
    getRequestLogByIdMock.mockResolvedValue(log);

    const jsx = await HistoryDetailPage({ id: 'log-1' });
    render(jsx);

    expect(screen.getByRole('link', { name: 'backToHistory' })).toHaveAttribute('href', '/history');
    expect(screen.getByRole('heading', { level: 1, name: log.url })).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders the error details block when the log has an error', async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: 'user-1' }) });
    getRequestLogByIdMock.mockResolvedValue({ ...log, errorDetails: 'Connection refused' });

    const jsx = await HistoryDetailPage({ id: 'log-1' });
    render(jsx);

    expect(screen.getByText('Connection refused')).toBeInTheDocument();
  });

  it('does not render the error details block when there is no error', async () => {
    cookiesMock.mockResolvedValue({ get: () => ({ value: 'user-1' }) });
    getRequestLogByIdMock.mockResolvedValue(log);

    const jsx = await HistoryDetailPage({ id: 'log-1' });
    render(jsx);

    expect(screen.queryByText('errorDetails')).not.toBeInTheDocument();
  });
});
