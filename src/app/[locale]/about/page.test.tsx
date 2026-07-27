import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './page';

vi.mock('@/views/aboutPage/AboutPage', () => ({
  default: () => <div data-testid="about-page-view" />,
}));

describe('About route', () => {
  it('renders the AboutPage view', () => {
    render(<About />);
    expect(screen.getByTestId('about-page-view')).toBeInTheDocument();
  });
});
