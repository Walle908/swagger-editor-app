import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import SignInPage from './SignInPage';
import styles from './SignInPage.module.scss';

const mockPush = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/firebase', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock('@/utils/uidCookie', () => ({
  setUidCookie: vi.fn(),
}));

vi.mock('@/components/authPages/decorPanel/DecorPanel', () => ({
  default: () => <div data-testid="mock-decor">Decor</div>,
}));

vi.mock('@/components/authPages/loginForm/LoginForm', () => ({
  default: ({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) => (
    <button
      data-testid="mock-submit-btn"
      onClick={() => onSubmit({ email: 'user@test.com', password: 'password123' })}>
      Submit Form
    </button>
  ),
}));

vi.mock('@/components/ui', () => ({
  Text: ({
    children,
    as: Tag = 'span',
    className,
  }: {
    children: ReactNode;
    as?: 'h1' | 'span';
    className?: string;
    size?: string;
    color?: string;
  }) => <Tag className={className}>{children}</Tag>,
  LinkComponent: ({
    children,
    href,
    className,
  }: {
    children: ReactNode;
    href: string;
    className?: string;
    variant?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('SignInPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render page layout with initial content and translations', () => {
    render(<SignInPage />);

    expect(screen.getByTestId('mock-decor')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'welcomeBack' })).toBeInTheDocument();
    expect(screen.getByText('signIn')).toBeInTheDocument();
    expect(screen.getByText('noAcc')).toBeInTheDocument();

    const signUpLink = screen.getByRole('link', { name: 'signup' });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });

  it('should successfully login user and redirect to home page', async () => {
    const user = userEvent.setup();

    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: { uid: 'auth_uid_123' },
    } as UserCredential);

    render(<SignInPage />);

    const submitBtn = screen.getByTestId('mock-submit-btn');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'user@test.com',
        'password123'
      );

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should display valid credentials error when Firebase throws auth/invalid-credential', async () => {
    const user = userEvent.setup();

    const error = new FirebaseError('auth/invalid-credential', 'Invalid credentials');
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(error);

    const { container } = render(<SignInPage />);

    const submitBtn = screen.getByTestId('mock-submit-btn');
    await user.click(submitBtn);

    await waitFor(() => {
      const errorBlock = container.querySelector(`.${styles.firebaseError}`);
      expect(errorBlock).toBeInTheDocument();
      expect(screen.getByText('errorInvalidCredentials')).toBeInTheDocument();
    });
  });

  it('should display generic fallback error on unexpected system rejections', async () => {
    const user = userEvent.setup();

    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(new Error('Network Crash'));

    const { container } = render(<SignInPage />);

    const submitBtn = screen.getByTestId('mock-submit-btn');
    await user.click(submitBtn);

    await waitFor(() => {
      const errorBlock = container.querySelector(`.${styles.firebaseError}`);
      expect(errorBlock).toBeInTheDocument();
      expect(screen.getByText('errorGlobal')).toBeInTheDocument();
    });
  });
});
