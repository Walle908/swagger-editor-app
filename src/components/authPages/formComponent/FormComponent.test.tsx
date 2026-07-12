import { type ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormComponent from './FormComponent';
import styles from './FormComponent.module.scss';

vi.mock('@/components/ui', () => ({
  Text: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
    as?: string;
    size?: string;
    color?: string;
  }) => <span className={className}>{children}</span>,
  Button: ({
    children,
    onClick,
    className,
    'aria-label': ariaLabel,
  }: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    color?: string;
    variant?: string;
    'aria-label'?: string;
  }) => (
    <button onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }) => {
    return <img src={src} alt={alt} width={width} height={height} />;
  },
}));

describe('FormComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render standard input with label and placeholder correctly', () => {
    render(<FormComponent label="Email" placeholder="Enter your email..." />);

    expect(screen.getByText('Email')).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText('Enter your email...') as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.className).toContain(styles.default);
    expect(inputElement.type).toBe('text');
  });

  it('should correctly link label and input using id attribute', () => {
    render(<FormComponent label="Name" id="custom-user-id" />);

    const labelElement = screen.getByText('Name');
    const inputElement = screen.getByLabelText('Name');

    expect(labelElement).toHaveAttribute('for', 'custom-user-id');
    expect(inputElement).toHaveAttribute('id', 'custom-user-id');
  });

  it('should render password input and toggle its visibility on eye button click', async () => {
    const user = userEvent.setup();
    render(<FormComponent label="Password" placeholder="Enter password..." isPassword />);

    const inputElement = screen.getByPlaceholderText('Enter password...') as HTMLInputElement;

    expect(inputElement.type).toBe('password');
    let eyeButton = screen.getByRole('button', { name: 'Hide password' });
    expect(eyeButton).toBeInTheDocument();

    let img = screen.getByRole('img', { name: 'Hide password' });
    expect(img).toHaveAttribute('src', '/hide.svg');

    await user.click(eyeButton);
    expect(inputElement.type).toBe('text');

    eyeButton = screen.getByRole('button', { name: 'Show password' });
    expect(eyeButton).toBeInTheDocument();

    img = screen.getByRole('img', { name: 'Show password' });
    expect(img).toHaveAttribute('src', '/show.svg');
  });

  it('should apply error classes and display error message when error prop is provided', () => {
    render(<FormComponent label="Field" error="This field is required" placeholder="Test error" />);

    const inputElement = screen.getByPlaceholderText('Test error');
    expect(inputElement.className).toContain(styles.error);

    const errorText = screen.getByText('This field is required');
    expect(errorText).toBeInTheDocument();
  });

  it('should forward react ref to the underlying HTML input element', () => {
    const testRef = { current: null as HTMLInputElement | null };
    render(<FormComponent label="Ref test" ref={testRef} placeholder="Ref placeholder" />);

    const inputElement = screen.getByPlaceholderText('Ref placeholder');
    expect(testRef.current).toBe(inputElement);
  });
});
