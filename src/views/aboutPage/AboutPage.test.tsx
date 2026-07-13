import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement, type ImgHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import AboutPage from './AboutPage';
import { teamMembers } from '@/constants/aboutInfo';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) =>
    createElement('img', { ...props, alt: props.alt || 'mock image' }),
}));

vi.mock('@/components/ui/logo/Logo', () => ({
  Logo: () => null,
}));

vi.mock('@/i18n/navigation', () => ({
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} href={String(props.href)} />
  ),
}));

describe('AboutPage', () => {
  beforeEach(() => {
    render(<AboutPage />);
  });

  it('renders the hero banner title', () => {
    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument();
  });

  it('renders the team section with a card per member', () => {
    expect(screen.getByRole('heading', { level: 2, name: 'teamHeading' })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(teamMembers.length);
  });

  it('renders the tech stack section', () => {
    expect(screen.getByRole('heading', { level: 2, name: 'builtWithHeading' })).toBeInTheDocument();
  });

  it('renders the course section', () => {
    expect(screen.getByRole('heading', { level: 2, name: 'heading' })).toBeInTheDocument();
  });
});
