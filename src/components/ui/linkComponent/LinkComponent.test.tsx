import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ComponentPropsWithoutRef } from 'react';
import { LinkComponent } from './LinkComponent';
import styles from './LinkComponent.module.scss';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, className, href, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a className={className} href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('LinkComponent', () => {
  it('should render basic link with default baseLink variant', () => {
    render(<LinkComponent href="/test-path">Click Link</LinkComponent>);

    const linkElement = screen.getByRole('link', { name: /click link/i });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test-path');
    expect(linkElement.className).toBe(styles.baseLink);
  });

  it('should render correct class based on variant prop', () => {
    render(
      <LinkComponent href="/signup" variant="authLink">
        Sign up
      </LinkComponent>
    );
    const linkElement = screen.getByRole('link');

    expect(linkElement.className).toBe(styles.authLink);
    expect(linkElement.className).not.toContain(styles.baseLink);
  });

  it('should apply active class when isActive is true', () => {
    render(
      <LinkComponent href="/history" variant="pageLink" isActive={true}>
        History
      </LinkComponent>
    );
    const linkElement = screen.getByRole('link');

    expect(linkElement.className).toContain(styles.pageLink);
    expect(linkElement.className).toContain(styles.active);
  });

  it('should support external global classes like colorfull', () => {
    render(
      <LinkComponent href="/" variant="buttonLink" className="colorfull">
        Sign Out
      </LinkComponent>
    );
    const linkElement = screen.getByRole('link');

    expect(linkElement.className).toContain(styles.buttonLink);
    expect(linkElement.className).toContain('colorfull');
  });

  it('should pass additional standard HTML attributes via rest props', () => {
    render(
      <LinkComponent href="/external" target="_blank" rel="noopener noreferrer">
        External
      </LinkComponent>
    );
    const linkElement = screen.getByRole('link');

    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
