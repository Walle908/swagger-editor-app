import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { cookies } from 'next/headers';
import HistoryDetail from './page';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

interface MockAuthGuardProps {
  children: ReactNode;
  serverUid?: string;
}

vi.mock('@/components/providers/AuthGuard', () => ({
  AuthGuard: ({ children, serverUid }: MockAuthGuardProps) => (
    <div data-testid="mock-auth-guard" data-server-uid={serverUid}>
      {children}
    </div>
  ),
}));

vi.mock('@/views/historyPage/HistoryDetailPage/HistoryDetailPage', () => ({
  default: ({ id }: { id: string }) => <div data-testid="history-detail-view">{id}</div>,
}));

describe('History detail route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render AuthGuard without HistoryDetailPage if uid cookie is missing', async () => {
    const mockGet = vi.fn().mockReturnValue(undefined);
    const mockCookieStore = {
      get: mockGet,
    } as unknown as Awaited<ReturnType<typeof cookies>>;

    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    const jsx = await HistoryDetail({ params: Promise.resolve({ id: 'log-42' }) });
    render(jsx);

    const authGuard = screen.getByTestId('mock-auth-guard');
    expect(authGuard).toBeInTheDocument();
    expect(authGuard).not.toHaveAttribute('data-server-uid', '');

    expect(screen.queryByTestId('history-detail-view')).not.toBeInTheDocument();
  });

  it('resolves the id param and renders the HistoryDetailPage view when authenticated via cookie', async () => {
    const mockGet = vi.fn().mockReturnValue({ value: 'user-123' });
    const mockCookieStore = {
      get: mockGet,
    } as unknown as Awaited<ReturnType<typeof cookies>>;

    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    const jsx = await HistoryDetail({ params: Promise.resolve({ id: 'log-42' }) });
    render(jsx);

    const authGuard = screen.getByTestId('mock-auth-guard');
    expect(authGuard).toBeInTheDocument();
    expect(authGuard).toHaveAttribute('data-server-uid', 'user-123');

    const detailView = screen.getByTestId('history-detail-view');
    expect(detailView).toBeInTheDocument();
    expect(detailView).toHaveTextContent('log-42');
  });
});
