import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement, type ImgHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import AboutTeamCard from './AboutTeamCard';
import { TeamMember } from '@/types/aboutPageTypes';

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

const member: TeamMember = {
  id: 1,
  role: 'Frontend Developer',
  github: 'https://github.com/YuliaEnik',
  image: 'https://avatars.githubusercontent.com/u/70852362?v=4',
};

describe('AboutTeamCard', () => {
  beforeEach(() => {
    render(<AboutTeamCard member={member} />);
  });

  it('renders the member name and role translation keys', () => {
    expect(screen.getByRole('heading', { level: 3, name: 'members.member1' })).toBeInTheDocument();
    expect(screen.getByText('roles.role1')).toBeInTheDocument();
  });

  it('renders the avatar image with correct src and alt', () => {
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', member.image);
    expect(avatar).toHaveAttribute('alt', 'members.member1');
  });

  it('renders a github link pointing to the member github profile', () => {
    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', member.github);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
