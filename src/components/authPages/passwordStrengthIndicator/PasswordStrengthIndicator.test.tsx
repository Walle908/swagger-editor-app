import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import styles from './PasswordStrengthIndicator.module.scss';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui', () => ({
  Text: ({
    children,
    className,
    'data-testid': testId,
  }: {
    children: ReactNode;
    className?: string;
    as?: string;
    size?: string;
    'data-testid'?: string;
  }) => (
    <span className={className} data-testid={testId}>
      {children}
    </span>
  ),
}));

describe('PasswordStrengthIndicator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correct default rules state when password value is empty', () => {
    const { container } = render(<PasswordStrengthIndicator value="" />);

    const invalidRules = container.querySelectorAll(`.${styles.invalidRule}`);
    expect(invalidRules).toHaveLength(4);

    const progressFills = container.querySelectorAll(`.${styles.progressBarFill}`);
    progressFills.forEach((fill) => {
      expect((fill as HTMLElement).style.width).toBe('0%');
      expect(fill.className).not.toContain(styles.activeFill || '');
    });

    const icons = screen.getAllByText('•');
    expect(icons).toHaveLength(4);
    expect(screen.queryByText('✓')).not.toBeInTheDocument();
  });

  it('should validate letter rule correctly', () => {
    const { container } = render(<PasswordStrengthIndicator value="a" />);

    const ruleText = screen.getByText('letter').closest('span');
    expect(ruleText).toHaveClass(styles.validRule as string);
    expect(screen.getByText('✓')).toBeInTheDocument();

    const progressFills = container.querySelectorAll(`.${styles.progressBarFill}`);
    const letterFill = progressFills[0] as HTMLElement;
    expect(letterFill.style.width).toBe('100%');
    expect(letterFill.className).toContain(styles.activeFill || '');

    const digitText = screen.getByText('digit').closest('span');
    expect(digitText).toHaveClass(styles.invalidRule as string);
  });

  it('should validate digit rule correctly', () => {
    const { container } = render(<PasswordStrengthIndicator value="1" />);

    const ruleText = screen.getByText('digit').closest('span');
    expect(ruleText).toHaveClass(styles.validRule as string);

    const progressFills = container.querySelectorAll(`.${styles.progressBarFill}`);
    const digitFill = progressFills[1] as HTMLElement;
    expect(digitFill.style.width).toBe('100%');
    expect(digitFill.className).toContain(styles.activeFill || '');
  });

  it('should validate special character rule correctly', () => {
    const { container } = render(<PasswordStrengthIndicator value="!" />);

    const ruleText = screen.getByText('specChar').closest('span');
    expect(ruleText).toHaveClass(styles.validRule as string);

    const progressFills = container.querySelectorAll(`.${styles.progressBarFill}`);
    const specFill = progressFills[2] as HTMLElement;
    expect(specFill.style.width).toBe('100%');
    expect(specFill.className).toContain(styles.activeFill || '');
  });

  it('should validate length rule correctly only when 8 or more characters provided', () => {
    const { rerender, container } = render(<PasswordStrengthIndicator value="1234567" />);

    const ruleTextBefore = screen.getByText('minLength').closest('span');
    expect(ruleTextBefore).toHaveClass(styles.invalidRule as string);

    let progressFills = container.querySelectorAll(`.${styles.progressBarFill}`);
    const lengthFillBefore = progressFills[3] as HTMLElement;
    expect(lengthFillBefore.style.width).toBe('0%');

    rerender(<PasswordStrengthIndicator value="12345678" />);

    const ruleTextAfter = screen.getByText('minLength').closest('span');
    expect(ruleTextAfter).toHaveClass(styles.validRule as string);

    progressFills = container.querySelectorAll(`.${styles.progressBarFill}`);
    const lengthFillAfter = progressFills[3] as HTMLElement;
    expect(lengthFillAfter.style.width).toBe('100%');
    expect(lengthFillAfter.className).toContain(styles.activeFill || '');
  });

  it('should activate all rules simultaneously when secure password is provided', () => {
    const { container } = render(<PasswordStrengthIndicator value="P@ssword1" />);

    const validRules = container.querySelectorAll(`.${styles.validRule}`);
    expect(validRules).toHaveLength(4);

    const checkmarks = screen.getAllByText('✓');
    expect(checkmarks).toHaveLength(4);

    const activeFills = container.querySelectorAll(`.${styles.activeFill}`);
    expect(activeFills).toHaveLength(4);
  });
});
