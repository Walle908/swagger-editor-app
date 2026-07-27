import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutCourse } from './AboutCourse';
import { skillsList } from '@/constants/aboutInfo';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui/logo/Logo', () => ({
  Logo: () => null,
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: { href: unknown; children: React.ReactNode }) => (
    <a href={typeof href === 'string' ? href : String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe('AboutCourse', () => {
  it('renders heading, intro and cta translation keys', () => {
    render(<AboutCourse />);

    expect(screen.getByRole('heading', { level: 2, name: 'heading' })).toBeInTheDocument();
    expect(screen.getByText('intro')).toBeInTheDocument();
    expect(screen.getByText('ctaQuestion')).toBeInTheDocument();
  });

  it('renders every skill from the skills list', () => {
    render(<AboutCourse />);

    skillsList.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('renders a link to the course with correct href and target', () => {
    render(<AboutCourse />);

    const link = screen.getByText('ctaLink');
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
