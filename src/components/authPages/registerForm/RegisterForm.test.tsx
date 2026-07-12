import { type ReactNode, type InputHTMLAttributes, Ref, forwardRef, useId } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from './RegisterForm';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/schema/authValidation', async () => {
  const { z } = await import('zod');
  return {
    getRegisterSchema: () =>
      z
        .object({
          name: z.string().min(2, 'shortName'),
          email: z.email('invalidEmail'),
          password: z.string().min(8, 'shortPassword'),
          confirmPassword: z.string(),
        })

        .refine(
          (data: Record<'password' | 'confirmPassword', string>) =>
            data.password === data.confirmPassword,
          {
            message: 'passwordsMismatch',
            path: ['confirmPassword'],
          }
        ),
  };
});

vi.mock('../formComponent/FormComponent', () => {
  interface MockProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    isPassword?: boolean;
  }

  const MockedFormComponent = forwardRef(
    (
      { label, placeholder, error, type, isPassword: _isPassword, ...props }: MockProps,
      ref: Ref<HTMLInputElement>
    ) => {
      const generatedId = useId();
      return (
        <div>
          <label htmlFor={generatedId}>{label}</label>
          <input id={generatedId} type={type} placeholder={placeholder} ref={ref} {...props} />
          {error && <span>{error}</span>}
        </div>
      );
    }
  );
  MockedFormComponent.displayName = 'FormComponent';
  return { default: MockedFormComponent };
});

vi.mock('../passwordStrengthIndicator/PasswordStrengthIndicator', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="mock-indicator">Indicator Value: {value}</div>
  ),
}));

vi.mock('@/components/ui', () => ({
  Button: ({
    children,
    type,
    disabled,
  }: {
    children: ReactNode;
    type?: string;
    disabled?: boolean;
  }) => (
    <button type={type as 'submit' | 'button'} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('RegisterForm Component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form controls and the strength indicator with translations', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('placeholderName')).toBeInTheDocument();

    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('placeholderEmail')).toBeInTheDocument();

    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('placeholderPassword')).toBeInTheDocument();

    expect(screen.getByLabelText('confirmPassword')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('placeholderConfPassword')).toBeInTheDocument();

    expect(screen.getByTestId('mock-indicator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'createAccount' })).toBeInTheDocument();
  });

  it('should reactive-update password strength indicator on typing via useWatch', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const passwordInput = screen.getByPlaceholderText('placeholderPassword');
    const indicator = screen.getByTestId('mock-indicator');

    expect(indicator).toHaveTextContent('Indicator Value:');

    await user.type(passwordInput, 'Secured123!');

    expect(indicator).toHaveTextContent('Indicator Value: Secured123!');
  });

  it('should trigger and display Zod validation errors on invalid input and block submit', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByPlaceholderText('placeholderName');
    const emailInput = screen.getByPlaceholderText('placeholderEmail');
    const passwordInput = screen.getByPlaceholderText('placeholderPassword');
    const confirmPasswordInput = screen.getByPlaceholderText('placeholderConfPassword');

    await user.type(nameInput, 'X');
    await user.type(emailInput, 'not-an-email');
    await user.type(passwordInput, '123');
    await user.type(confirmPasswordInput, '456');

    await waitFor(() => {
      expect(screen.getByText('shortName')).toBeInTheDocument();
      expect(screen.getByText('invalidEmail')).toBeInTheDocument();
      expect(screen.getByText('shortPassword')).toBeInTheDocument();
      expect(screen.getByText('passwordsMismatch')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: 'createAccount' });
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should successfully call onSubmit with valid fields and matching passwords', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByPlaceholderText('placeholderName');
    const emailInput = screen.getByPlaceholderText('placeholderEmail');
    const passwordInput = screen.getByPlaceholderText('placeholderPassword');
    const confirmPasswordInput = screen.getByPlaceholderText('placeholderConfPassword');

    await user.type(nameInput, 'Elena');
    await user.type(emailInput, 'elena@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'createAccount' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          name: 'Elena',
          email: 'elena@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        },
        expect.any(Object)
      );
    });
  });
});
