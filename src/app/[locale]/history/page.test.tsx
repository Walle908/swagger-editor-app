import { type ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import History from './page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

interface AuthGuardProps {
  children: ReactNode;
}

vi.mock('@/components/providers/AuthGuard', () => ({
  AuthGuard: ({ children }: AuthGuardProps) => <div data-testid="mock-auth-guard">{children}</div>,
}));

interface HistoryPageProps {
  uid: string;
}

vi.mock('@/views/historyPage/HistoryPage', () => ({
  default: ({ uid }: HistoryPageProps) => <div data-testid="mock-history-page" data-uid={uid} />,
}));

interface MockJsxElement {
  type: unknown;
  props: {
    children: MockJsxElement;
    uid?: string;
  };
}

describe('History Server Route (page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should immediately redirect to home page if uid cookie is missing', async () => {
    const mockGet = vi.fn().mockReturnValue(undefined);
    const mockCookieStore = {
      get: mockGet,
    } as unknown as Awaited<ReturnType<typeof cookies>>;

    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    await History();

    expect(mockGet).toHaveBeenCalledWith('uid');
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('should render AuthGuard and HistoryPage when authenticated via uid cookie', async () => {
    const mockGet = vi.fn().mockReturnValue({ value: 'user_secure_999' });
    const mockCookieStore = {
      get: mockGet,
    } as unknown as Awaited<ReturnType<typeof cookies>>;

    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    const result = (await History()) as unknown as MockJsxElement;

    expect(redirect).not.toHaveBeenCalled();

    expect(result.type).not.toBeNull();

    const historyPageChild = result.props.children;

    expect(historyPageChild.props.uid).toBe('user_secure_999');
  });
});
