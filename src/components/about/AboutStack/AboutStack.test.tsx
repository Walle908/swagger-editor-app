import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutStack } from './AboutStack';
import { techStack } from '@/constants/aboutInfo';

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

describe('AboutStack', () => {
  it('renders the heading translation key', () => {
    render(<AboutStack />);

    expect(screen.getByRole('heading', { level: 2, name: 'builtWithHeading' })).toBeInTheDocument();
  });

  it('renders every technology from the tech stack', () => {
    render(<AboutStack />);

    techStack.forEach((tech) => {
      expect(screen.getByText(tech.stackName)).toBeInTheDocument();
    });
  });

  it('renders the tech stack as a list with matching item count', () => {
    render(<AboutStack />);

    expect(screen.getAllByRole('listitem')).toHaveLength(techStack.length);
  });
});
