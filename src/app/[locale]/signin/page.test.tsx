import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignIn from './page';

vi.mock('@/views/signInPage/SignInPage', () => ({
  default: () => <div data-testid="mock-signin-page">Sign In Form</div>,
}));

vi.mock('@/components/providers/GuestGuard', () => ({
  GuestGuard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-guest-guard">{children}</div>
  ),
}));

describe('SignIn Page Component', () => {
  it('should successfully render SignInPage wrapped inside GuestGuard', () => {
    render(<SignIn />);

    const guestGuard = screen.getByTestId('mock-guest-guard');
    expect(guestGuard).toBeInTheDocument();

    const signInPage = screen.getByTestId('mock-signin-page');
    expect(signInPage).toBeInTheDocument();

    expect(guestGuard).toContainElement(signInPage);
  });
});
