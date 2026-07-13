import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitcher from './LanguageSwitcher';

const mockReplace = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/current-page',
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

let mockCurrentLocale = 'en';
vi.mock('next-intl', () => ({
  useLocale: () => mockCurrentLocale,
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentLocale = 'en';
  });

  it('should render language switcher layout with all options', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('RU')).toBeInTheDocument();

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(2);
    radioButtons.forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'language');
    });
  });

  it('should check correct radio button based on current active locale', () => {
    const { rerender } = render(<LanguageSwitcher />);

    const enRadio = screen.getByDisplayValue('en') as HTMLInputElement;
    const ruRadio = screen.getByDisplayValue('ru') as HTMLInputElement;

    expect(enRadio.checked).toBe(true);
    expect(ruRadio.checked).toBe(false);

    mockCurrentLocale = 'ru';
    rerender(<LanguageSwitcher />);

    expect(enRadio.checked).toBe(false);
    expect(ruRadio.checked).toBe(true);
  });

  it('should trigger router replace with next locale configuration when changed', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const ruRadio = screen.getByDisplayValue('ru');

    await user.click(ruRadio);

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/current-page', { locale: 'ru' });
  });
});
