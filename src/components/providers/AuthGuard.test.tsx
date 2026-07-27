import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import type { User, Auth, NextOrObserver } from 'firebase/auth';
import { onIdTokenChanged } from 'firebase/auth';
import { useRouter } from '@/i18n/navigation';
import { AuthGuard } from './AuthGuard';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

vi.mock('@/i18n/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/firebase', () => ({
  auth: {} as Auth,
}));

vi.mock('firebase/auth', () => ({
  onIdTokenChanged: vi.fn(),
}));

vi.mock('@/components/authPages/unauthorized/Unauthorized', () => ({
  default: () => <div data-testid="mock-unauthorized">401 Unauthorized</div>,
}));

describe('AuthGuard Component', () => {
  const mockReplace = vi.fn();
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();

    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace,
    } as unknown as ReturnType<typeof useRouter>);

    vi.mocked(onIdTokenChanged).mockReturnValue(mockUnsubscribe);
  });

  it('should render nothing (null) while auth state is loading', () => {
    render(
      <AuthGuard>
        <div data-testid="protected-content">Private Data</div>
      </AuthGuard>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-unauthorized')).not.toBeInTheDocument();
  });

  it('should render UnauthorizedPage and then redirect unauthenticated users to home page after timeout', async () => {
    vi.mocked(onIdTokenChanged).mockImplementation(
      (_auth: Auth, callback: NextOrObserver<User>) => {
        if (typeof callback === 'function') {
          callback(null);
        }
        return mockUnsubscribe;
      }
    );

    render(
      <AuthGuard>
        <div data-testid="protected-content">Private Data</div>
      </AuthGuard>
    );

    expect(screen.getByTestId('mock-unauthorized')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();

    await sleep(3050);

    expect(mockReplace).toHaveBeenCalledWith('/');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  }, 6000);

  it('should render children successfully if token is valid', async () => {
    const mockGetIdToken = vi.fn().mockResolvedValue('valid_token_string');
    const mockUser = { getIdToken: mockGetIdToken } as Partial<User> as User;

    vi.mocked(onIdTokenChanged).mockImplementation(
      (_auth: Auth, callback: NextOrObserver<User>) => {
        if (typeof callback === 'function') {
          callback(mockUser);
        }
        return mockUnsubscribe;
      }
    );

    render(
      <AuthGuard>
        <div data-testid="protected-content">Private Data</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(mockGetIdToken).toHaveBeenCalledWith(true);
    });

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-unauthorized')).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should render UnauthorizedPage and redirect to home page if token refresh throws an error', async () => {
    const mockGetIdToken = vi.fn().mockRejectedValue(new Error('Token expired'));
    const mockUser = { getIdToken: mockGetIdToken } as Partial<User> as User;

    vi.mocked(onIdTokenChanged).mockImplementation(
      (_auth: Auth, callback: NextOrObserver<User>) => {
        if (typeof callback === 'function') {
          callback(mockUser);
        }
        return mockUnsubscribe;
      }
    );

    render(
      <AuthGuard>
        <div data-testid="protected-content">Private Data</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-unauthorized')).toBeInTheDocument();
    });

    expect(mockReplace).not.toHaveBeenCalled();

    await sleep(3050);

    expect(mockReplace).toHaveBeenCalledWith('/');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  }, 6000);

  it('should call unsubscribe when component unmounts', () => {
    const { unmount } = render(
      <AuthGuard>
        <div />
      </AuthGuard>
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
