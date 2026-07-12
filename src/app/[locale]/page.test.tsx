import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import LocaleRootPage from './page';

vi.mock('@/views/mainPage/MainPage', () => ({
  default: () => <div data-testid="mock-main-page">Main Page Layout</div>,
}));

describe('LocaleRootPage Component', () => {
  test('should render successfully and contain the MainPage component', () => {
    render(<LocaleRootPage />);

    const mainPageElement = screen.getByTestId('mock-main-page');
    expect(mainPageElement).toBeInTheDocument();
    expect(mainPageElement).toHaveTextContent('Main Page Layout');
  });
});
