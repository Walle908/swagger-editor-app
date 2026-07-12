import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';
import styles from './Header.module.scss';

const mockPush = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

type AuthCallback = (user: { uid: string; displayName: string | null } | null) => void;
const mockOnIdTokenChanged = vi.fn<(callback: AuthCallback) => void>();
const mockSignOut = vi.fn();

vi.mock('@/firebase', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({
  onIdTokenChanged: (_auth: unknown, callback: AuthCallback) => {
    mockOnIdTokenChanged(callback);
    return () => vi.fn();
  },
  signOut: () => mockSignOut(),
}));

vi.mock('@/utils/uidCookie', () => ({
  setUidCookie: vi.fn(),
  clearUidCookie: vi.fn(),
}));

vi.mock('@/utils/getInitials', () => ({
  default: () => 'U',
}));

vi.mock('@/components/ui', () => ({
  Logo: () => <div data-testid="mock-logo">Logo</div>,
  LinkComponent: ({
    children,
    href,
    onClick,
    className,
  }: {
    children: ReactNode;
    href: string;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    variant?: string;
    isActive?: boolean;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/languageSwitcher/LanguageSwitcher', () => ({
  default: () => <div>Lang</div>,
}));

vi.mock('@/components/themeSwitcher/ThemeSwitcher', () => ({
  default: () => <div>Theme</div>,
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.className = '';
  });

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('should render loading state correctly (buttons hidden initially)', () => {
    mockOnIdTokenChanged.mockImplementationOnce(() => {});
    render(<Header />);

    expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
    expect(screen.queryByText('signin')).not.toBeInTheDocument();
  });

  it('should render public links when user is unauthenticated', () => {
    mockOnIdTokenChanged.mockImplementationOnce((callback) => callback(null));
    render(<Header />);

    expect(screen.getAllByText('signin')[0]).toBeInTheDocument();
    expect(screen.getAllByText('signup')[0]).toBeInTheDocument();
    expect(screen.queryByText('history')).not.toBeInTheDocument();
  });

  it('should render avatar with user name in title when authenticated', () => {
    mockOnIdTokenChanged.mockImplementationOnce((callback) =>
      callback({ uid: '123', displayName: 'John Doe' })
    );
    render(<Header />);

    const avatarBlock = screen.getByText('U');
    expect(avatarBlock).toBeInTheDocument();
    expect(avatarBlock).toHaveAttribute('title', 'John Doe');
  });

  it('should fallback to title "User" when displayName is missing', () => {
    mockOnIdTokenChanged.mockImplementationOnce((callback) =>
      callback({ uid: '123', displayName: null })
    );
    render(<Header />);

    const avatarBlock = screen.getByText('U');
    expect(avatarBlock).toBeInTheDocument();
    expect(avatarBlock).toHaveAttribute('title', 'User');
  });

  it('should call Firebase signOut and redirect to home on logout click', async () => {
    mockOnIdTokenChanged.mockImplementationOnce((callback) =>
      callback({ uid: '123', displayName: 'John Doe' })
    );
    const user = userEvent.setup();
    render(<Header />);

    const signOutButton = screen.getByText('signout');
    await user.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should toggle scrolled class on scroll down and remove it on scroll up', () => {
    mockOnIdTokenChanged.mockImplementationOnce((callback) => callback(null));
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header.className).not.toContain(styles.scrolled);

    Object.defineProperty(window, 'scrollY', { value: 15, writable: true });
    fireEvent.scroll(window);
    expect(header.className).toContain(styles.scrolled);

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    fireEvent.scroll(window);
    expect(header.className).not.toContain(styles.scrolled);
  });

  it('should toggle mobile menu and body lock when burger button is clicked', async () => {
    mockOnIdTokenChanged.mockImplementationOnce((callback) => callback(null));
    const user = userEvent.setup();
    render(<Header />);

    const burgerButton = screen.getByRole('button', { name: /toggle menu/i });

    expect(burgerButton.className).not.toContain(styles.burgerActive);
    expect(document.body.classList.contains('no-scroll')).toBe(false);

    await user.click(burgerButton);
    expect(burgerButton.className).toContain(styles.burgerActive);
    expect(document.body.classList.contains('no-scroll')).toBe(true);

    await user.click(burgerButton);
    expect(burgerButton.className).not.toContain(styles.burgerActive);
    expect(document.body.classList.contains('no-scroll')).toBe(false);
  });

  it('should call Firebase signOut and redirect to home on logout click', async () => {
    mockOnIdTokenChanged.mockImplementationOnce((callback) =>
      callback({ uid: '123', displayName: 'John Doe' })
    );
    const user = userEvent.setup();
    render(<Header />);

    const signOutButton = screen.getByText('signout');
    await user.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
