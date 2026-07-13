import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUp from './page';

vi.mock('@/views/signUpPage/SignUpPage', () => ({
  default: () => <div data-testid="mock-signup-page">Sign Up Form</div>,
}));

vi.mock('@/components/providers/GuestGuard', () => ({
  GuestGuard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-guest-guard">{children}</div>
  ),
}));

describe('SignUp Page Component', () => {
  it('should successfully render SignUpPage wrapped inside GuestGuard', () => {
    render(<SignUp />);

    const guestGuard = screen.getByTestId('mock-guest-guard');
    expect(guestGuard).toBeInTheDocument();

    const signUpPage = screen.getByTestId('mock-signup-page');
    expect(signUpPage).toBeInTheDocument();
    expect(guestGuard).toContainElement(signUpPage);
  });
});
