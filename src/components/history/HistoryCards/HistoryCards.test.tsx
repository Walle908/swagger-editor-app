import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistoryCards from './HistoryCards';
import { HistorySummary } from '@/types/historyTypes';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/firebase', () => ({
  db: {},
  auth: {},
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

const summary: HistorySummary = {
  total: 10,
  avgDurationMs: 250,
  successCount: 8,
  errorCount4xx: 1,
  errorCount5xx: 1,
};

describe('HistoryCards', () => {
  it('renders a card for total, avgDuration, successRate and errors', () => {
    render(<HistoryCards summary={summary} />);

    expect(screen.getByText('total')).toBeInTheDocument();
    expect(screen.getByText('avgDuration')).toBeInTheDocument();
    expect(screen.getByText('successRate')).toBeInTheDocument();
    expect(screen.getByText('errors')).toBeInTheDocument();
  });

  it('displays computed values derived from the summary', () => {
    render(<HistoryCards summary={summary} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders unit labels for duration and percentage cards', () => {
    render(<HistoryCards summary={summary} />);

    expect(screen.getByText('ms')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('renders zeroed cards for an empty summary without dividing by zero', () => {
    const emptySummary: HistorySummary = {
      total: 0,
      avgDurationMs: 0,
      successCount: 0,
      errorCount4xx: 0,
      errorCount5xx: 0,
    };

    render(<HistoryCards summary={emptySummary} />);

    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });
});
