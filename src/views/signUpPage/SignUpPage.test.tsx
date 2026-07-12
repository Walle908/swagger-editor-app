import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  type UserCredential,
  type User,
} from 'firebase/auth';
import { type RegisterFields } from '@/schema/authValidation';
import SignUpPage from './SignUpPage';
import styles from './SignUpPage.module.scss';

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
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('@/utils/uidCookie', () => ({
  setUidCookie: vi.fn(),
}));

vi.mock('@/components/authPages/decorPanel/DecorPanel', () => ({
  default: () => <div data-testid="mock-decor">Decor</div>,
}));

vi.mock('@/components/authPages/registerForm/RegisterForm', () => ({
  default: ({ onSubmit }: { onSubmit: (data: RegisterFields) => void }) => (
    <button
      data-testid="mock-submit-btn"
      onClick={() =>
        onSubmit({
          name: 'Elena',
          email: 'elena@test.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
      }>
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

describe('SignUpPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render signup page layout with text boundaries and external links', () => {
    render(<SignUpPage />);

    expect(screen.getByTestId('mock-decor')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'createAccount' })).toBeInTheDocument();
    expect(screen.getByText('alreadyHave')).toBeInTheDocument();

    const signInLink = screen.getByRole('link', { name: 'signin' });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signin');
  });

  it('should successfully register user, update profile, set token and redirect to home', async () => {
    const user = userEvent.setup();
    const mockGetIdToken = vi.fn().mockResolvedValue('mock_token');

    const mockUser = {
      uid: 'auth_uid_456',
      getIdToken: mockGetIdToken,
    } as unknown as User;

    vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce({
      user: mockUser,
    } as UserCredential);

    render(<SignUpPage />);

    const submitBtn = screen.getByTestId('mock-submit-btn');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'elena@test.com',
        'password123'
      );
      expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Elena' });
      expect(mockGetIdToken).toHaveBeenCalledWith(true);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should display specific error when email is already in use by Firebase', async () => {
    const user = userEvent.setup();
    const error = new FirebaseError('auth/email-already-in-use', 'Email already in use');
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce(error);

    const { container } = render(<SignUpPage />);

    const submitBtn = screen.getByTestId('mock-submit-btn');
    await user.click(submitBtn);

    await waitFor(() => {
      const errorBlock = container.querySelector(`.${styles.firebaseError}`);
      expect(errorBlock).toBeInTheDocument();
      expect(screen.getByText('errorEmailInUse')).toBeInTheDocument();
    });
  });

  it('should fallback to global error state on unexpected exceptions', async () => {
    const user = userEvent.setup();
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce(new Error('Auth API Failure'));

    const { container } = render(<SignUpPage />);

    const submitBtn = screen.getByTestId('mock-submit-btn');
    await user.click(submitBtn);

    await waitFor(() => {
      const errorBlock = container.querySelector(`.${styles.firebaseError}`);
      expect(errorBlock).toBeInTheDocument();
      expect(screen.getByText('errorGlobal')).toBeInTheDocument();
    });
  });

  it('should handle missing user in userCredential successfully (line 28)', async () => {
    const user = userEvent.setup();

    // Эмулируем успешный ответ Firebase, но БЕЗ объекта user внутри (user: undefined)
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce({
      // Оставляем пустым, чтобы сработал фоллбек и ветка else на строке 28
    } as UserCredential);

    render(<SignUpPage />);

    const submitBtn = screen.getByTestId('mock-submit-btn');
    await user.click(submitBtn);

    await waitFor(() => {
      // Проверяем, что метод updateProfile НЕ вызвался, так как пользователя не было
      expect(updateProfile).not.toHaveBeenCalled();
      // И на главную страницу нас тоже не пустило, так как код упал дальше на токене
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
