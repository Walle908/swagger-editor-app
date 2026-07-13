import { type ReactNode, type InputHTMLAttributes, Ref, forwardRef, useId } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/schema/authValidation', async () => {
  const { z } = await import('zod');
  return {
    getLoginSchema: () =>
      z.object({
        email: z.string().email('invalidEmail'),
        password: z.string().min(6, 'shortPassword'),
      }),
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

describe('LoginForm Component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render fields and submit button with translations', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('placeholderEmail')).toBeInTheDocument();

    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('placeholderPassword')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'signIn' })).toBeInTheDocument();
  });

  it('should display validation errors when fields are filled incorrectly', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByPlaceholderText('placeholderEmail');
    const passwordInput = screen.getByPlaceholderText('placeholderPassword');

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, '123');

    await waitFor(() => {
      expect(screen.getByText('invalidEmail')).toBeInTheDocument();
      expect(screen.getByText('shortPassword')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: 'signIn' });
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should successfully submit form when all data is valid', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByPlaceholderText('placeholderEmail');
    const passwordInput = screen.getByPlaceholderText('placeholderPassword');

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: 'signIn' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(
        { email: 'user@example.com', password: 'password123' },
        expect.any(Object)
      );
    });
  });
});
