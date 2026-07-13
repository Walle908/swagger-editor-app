import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement, type ImgHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import { AboutTeam } from './AboutTeam';
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

describe('AboutTeam', () => {
  beforeEach(() => {
    render(<AboutTeam />);
  });

  it('renders the team heading translation key', () => {
    expect(screen.getByRole('heading', { level: 2, name: 'teamHeading' })).toBeInTheDocument();
  });

  it('renders a card for every team member', () => {
    expect(screen.getAllByRole('img')).toHaveLength(teamMembers.length);
    expect(screen.getAllByRole('link', { name: 'GitHub' })).toHaveLength(teamMembers.length);
  });
});
