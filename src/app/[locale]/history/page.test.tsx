import { type ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { cookies } from 'next/headers';
import History from './page';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

interface MockAuthGuardProps {
  children: ReactNode;
  serverUid?: string;
}

interface MockHistoryPageProps {
  uid: string;
}

vi.mock('@/components/providers/AuthGuard', () => ({
  AuthGuard: ({ children, serverUid }: MockAuthGuardProps) => (
    <div data-testid="mock-auth-guard" data-server-uid={serverUid}>
      {children}
    </div>
  ),
}));

vi.mock('@/views/historyPage/HistoryPage', () => ({
  default: ({ uid }: MockHistoryPageProps) => (
    <div data-testid="mock-history-page" data-uid={uid} />
  ),
}));

interface MockJsxElement {
  props: {
    serverUid?: string;
    children: MockJsxElement | null;
    uid?: string;
  };
}

describe('History Server Route (page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render AuthGuard without HistoryPage if uid cookie is missing', async () => {
    const mockGet = vi.fn().mockReturnValue(undefined);
    const mockCookieStore = {
      get: mockGet,
    } as unknown as Awaited<ReturnType<typeof cookies>>;

    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    const result = (await History()) as unknown as MockJsxElement;

    expect(mockGet).toHaveBeenCalledWith('uid');

    expect(result.props.serverUid).toBeUndefined();

    expect(result.props.children).toBeNull();
  });

  it('should render AuthGuard and pass uid to HistoryPage when authenticated via cookie', async () => {
    const mockGet = vi.fn().mockReturnValue({ value: 'user_secure_999' });
    const mockCookieStore = {
      get: mockGet,
    } as unknown as Awaited<ReturnType<typeof cookies>>;

    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    const result = (await History()) as unknown as MockJsxElement;

    expect(mockGet).toHaveBeenCalledWith('uid');

    expect(result.props.serverUid).toBe('user_secure_999');

    const historyPageChild = result.props.children;
    expect(historyPageChild).not.toBeNull();
    expect(historyPageChild?.props.uid).toBe('user_secure_999');
  });
});
