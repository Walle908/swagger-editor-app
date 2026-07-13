import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { onIdTokenChanged, type User, type NextOrObserver, type Auth } from 'firebase/auth';
import { useRouter } from '@/i18n/navigation';
import { AuthGuard } from './AuthGuard';

vi.mock('@/i18n/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/firebase', () => ({
  auth: {} as Auth,
}));

vi.mock('firebase/auth', () => ({
  onIdTokenChanged: vi.fn(),
}));

describe('AuthGuard Component', () => {
  const mockReplace = vi.fn();
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

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
  });

  it('should redirect unauthenticated users to home page', async () => {
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

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should render children successfully if token is valid', async () => {
    const mockGetIdToken = vi.fn().mockResolvedValue('valid_token_string');
    const mockUser = {
      getIdToken: mockGetIdToken,
    } as unknown as User;

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
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should redirect to home page if token refresh throws an error', async () => {
    const mockGetIdToken = vi.fn().mockRejectedValue(new Error('Token expired'));
    const mockUser = {
      getIdToken: mockGetIdToken,
    } as unknown as User;

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
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

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
