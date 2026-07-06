import { mockLogs } from '@/constants/historyConstants';
import { HistorySummary, RequestLog, statusToneType } from '@/types/historyTypes';
export const getStatusTone = (code: number): statusToneType => {
  return code >= 500 ? 'error' : code >= 400 ? 'warning' : 'success';
};

export const formatSize = (formatByte: number): string => {
  return formatByte < 1024
    ? `${formatByte} B`
    : formatByte < 1024 * 1024
      ? `${(formatByte / 1024).toFixed(1)} KB`
      : `${(formatByte / (1024 * 1024)).toFixed(1)} MB`;
};
export const formatDuration = (durationMs: number): string => {
  return durationMs < 1000 ? `${durationMs} ms` : `${(durationMs / 1000).toFixed(2)} s`;
};
export function sortByTimestampDesc(logs: RequestLog[]): RequestLog[] {
  return [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
export const getMethodKey = (method: string): string => {
  return method.toLowerCase();
};
export const buildSummaryElements = (logs: RequestLog[]): HistorySummary => {
  const total = logs.length;
  const totalDuration = logs.reduce((sum, log) => sum + log.durationMs, 0);
  const avg = total ? totalDuration / total : 0;
  return {
    total,
    avgDurationMs: Math.round(avg),
    successCount: logs.filter((l) => getStatusTone(l.statusCode) === 'success').length,
    errorCount4xx: logs.filter((l) => l.statusCode >= 400 && l.statusCode < 500).length,
    errorCount5xx: logs.filter((l) => l.statusCode >= 500).length,
  };
};

export const getCardsInfo = (summary: HistorySummary) => {
  const successRate = summary.total ? Math.round((summary.successCount / summary.total) * 100) : 0;
  const cards = [
    { id: '1', label: 'total', value: String(summary.total), unit: '', tone: 'default' },
    {
      id: '2',
      label: 'avgDuration',
      value: String(summary.avgDurationMs),
      unit: 'ms',
      tone: 'default',
    },
    { id: '3', label: 'successRate', value: String(successRate), unit: '%', tone: 'success' },
    {
      id: '4',
      label: 'errors',
      value: String(summary.errorCount4xx + summary.errorCount5xx),
      unit: '',
      tone: 'error',
    },
  ];
  return cards;
};

export const mockSortedLogs = sortByTimestampDesc(mockLogs);
export const mockSummary = buildSummaryElements(mockSortedLogs);
