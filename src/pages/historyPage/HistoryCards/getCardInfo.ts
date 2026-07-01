import { HistorySummary } from '@/types/historyTypes';

export const getCardsInfo = (summary: HistorySummary) => {
  const successRate = summary.total ? Math.round((summary.successCount / summary.total) * 100) : 0;
  const cards = [
    {
      label: 'Total requests',
      value: String(summary.total),
      unit: '',
      tone: 'default',
    },
    {
      label: 'Avg duration',
      value: String(summary.avgDurationMs),
      unit: 'ms',
      tone: 'default',
    },
    {
      label: 'Success rate',
      value: String(successRate),
      unit: '%',
      tone: 'success',
    },
    {
      label: 'Errors',
      value: String(summary.errorCount4xx + summary.errorCount5xx),
      unit: '',
      tone: 'error',
    },
  ];
  return cards;
};
