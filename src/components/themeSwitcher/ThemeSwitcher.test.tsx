import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeSwitcher from './ThemeSwitcher';
import styles from './ThemeSwitcher.module.scss';

const mockToggleTheme = vi.fn();
let mockCurrentTheme = 'light';

vi.mock('@/store/themeStore', () => ({
  useThemeStore: (selector: (state: { theme: string; toggleTheme: () => void }) => unknown) => {
    return selector({
      theme: mockCurrentTheme,
      toggleTheme: mockToggleTheme,
    });
  },
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string; priority?: boolean }) => {
    return <img src={src} alt={alt} />;
  },
}));

describe('ThemeSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentTheme = 'light';
    document.documentElement.removeAttribute('data-theme');
  });

  it('should render light theme button with moon icon by default', () => {
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toBe(styles.themeBtn);

    const img = screen.getByRole('img', { name: /light theme/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/moon.svg');

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('should render dark theme button with sunny icon when theme is dark', () => {
    mockCurrentTheme = 'dark';
    render(<ThemeSwitcher />);

    const img = screen.getByRole('img', { name: /dark theme/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/sunny.svg');

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('should call toggleTheme from store when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
