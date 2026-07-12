import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GuestGuard } from './GuestGuard';

const mockReplace = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

type AuthCallback = (user: { uid: string } | null) => void;
const mockOnIdTokenChanged = vi.fn<(callback: AuthCallback) => void>();

vi.mock('@/firebase', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({
  onIdTokenChanged: (_auth: unknown, callback: AuthCallback) => {
    mockOnIdTokenChanged(callback);
    return () => vi.fn();
  },
}));

describe('GuestGuard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing (null) and keep loading while Firebase auth is initializing', () => {
    mockOnIdTokenChanged.mockImplementationOnce(() => {});

    render(
      <GuestGuard>
        <div data-testid="child-content">Protected Content</div>
      </GuestGuard>
    );

    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
  });

  it('should redirect to home page and not render children if user is authenticated', () => {
    mockOnIdTokenChanged.mockImplementationOnce((callback) => callback({ uid: 'user_123' }));

    render(
      <GuestGuard>
        <div data-testid="child-content">Protected Content</div>
      </GuestGuard>
    );

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/');

    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
  });

  it('should stop loading and successfully render children if user is a guest', () => {
    mockOnIdTokenChanged.mockImplementationOnce((callback) => callback(null));

    render(
      <GuestGuard>
        <div data-testid="child-content">Protected Content</div>
      </GuestGuard>
    );

    expect(mockReplace).not.toHaveBeenCalled();

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
