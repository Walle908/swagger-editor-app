import { Column, HistorySummary, RequestLog, statusToneType } from '@/types/historyTypes';
import { Text } from '@/components/ui';
export const statusTone = (code: number): statusToneType => {
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
export const methodKey = (method: string): string => {
  return method.toLowerCase();
};
export const buildSummaryElements = (logs: RequestLog[]): HistorySummary => {
  const total = logs.length;
  const totalDuration = logs.reduce((sum, log) => sum + log.durationMs, 0);
  const avg = total ? totalDuration / total : 0;
  return {
    total,
    avgDurationMs: Math.round(avg),
    successCount: logs.filter((l) => statusTone(l.statusCode) === 'success').length,
    errorCount4xx: logs.filter((l) => l.statusCode >= 400 && l.statusCode < 500).length,
    errorCount5xx: logs.filter((l) => l.statusCode >= 500).length,
  };
};

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

export const mockLogs: RequestLog[] = [
  {
    id: '2',
    userId: 'u1',
    method: 'GET',
    endpoint: '/pet/findByStatus',
    url: 'https://petstore3.swagger.io/api/v3/pet/findByStatus',
    statusCode: 200,
    durationMs: 142,
    requestSize: 0,
    responseSize: 4200,
    timestamp: '2026-06-27T18:41:55Z',
    errorDetails: null,
  },
  {
    id: '3',
    userId: 'u1',
    method: 'GET',
    endpoint: '/pet/9223372036854',
    url: 'https://petstore3.swagger.io/api/v3/pet/9223372036854',
    statusCode: 404,
    durationMs: 96,
    requestSize: 0,
    responseSize: 142,
    timestamp: '2026-06-27T18:40:12Z',
    errorDetails: 'Pet not found',
  },
  {
    id: '4',
    userId: 'u1',
    method: 'PUT',
    endpoint: '/pet',
    url: 'https://petstore3.swagger.io/api/v3/pet',
    statusCode: 200,
    durationMs: 173,
    requestSize: 448,
    responseSize: 880,
    timestamp: '2026-06-27T18:38:47Z',
    errorDetails: null,
  },
  {
    id: '5',
    userId: 'u1',
    method: 'PATCH',
    endpoint: '/pet/10',
    url: 'https://petstore3.swagger.io/api/v3/pet/10',
    statusCode: 200,
    durationMs: 118,
    requestSize: 96,
    responseSize: 880,
    timestamp: '2026-06-27T18:36:20Z',
    errorDetails: null,
  },
  {
    id: '6',
    userId: 'u1',
    method: 'DELETE',
    endpoint: '/pet/10',
    url: 'https://petstore3.swagger.io/api/v3/pet/10',
    statusCode: 200,
    durationMs: 104,
    requestSize: 0,
    responseSize: 0,
    timestamp: '2026-06-27T18:35:02Z',
    errorDetails: null,
  },
  {
    id: '1',
    userId: 'u1',
    method: 'POST',
    endpoint: '/pet',
    url: 'https://petstore3.swagger.io/api/v3/pet',
    statusCode: 201,
    durationMs: 128,
    requestSize: 412,
    responseSize: 880,
    timestamp: '2026-06-27T18:42:09Z',
    errorDetails: null,
  },
  {
    id: '7',
    userId: 'u1',
    method: 'POST',
    endpoint: '/user/createWithList',
    url: 'https://petstore3.swagger.io/api/v3/user/createWithList',
    statusCode: 500,
    durationMs: 2410,
    requestSize: 1200,
    responseSize: 318,
    timestamp: '2026-06-27T18:31:44Z',
    errorDetails: 'Internal server error',
  },
  {
    id: '8',
    userId: 'u1',
    method: 'GET',
    endpoint: '/store/inventory',
    url: 'https://petstore3.swagger.io/api/v3/store/inventory',
    statusCode: 200,
    durationMs: 88,
    requestSize: 0,
    responseSize: 612,
    timestamp: '2026-06-27T18:29:10Z',
    errorDetails: null,
  },
];

export const mockSortedLogs = sortByTimestampDesc(mockLogs);
export const mockSummary = buildSummaryElements(mockSortedLogs);

export const emptyLogs: RequestLog[] = [];

export const columns: Column<RequestLog>[] = [
  {
    key: 'method',
    label: 'Method',
    render: (log, styles) => (
      <Text as="p" weight="bold" className={styles?.method} data-method={methodKey(log.method)}>
        {log.method}
      </Text>
    ),
  },
  {
    key: 'endpoint',
    label: 'Endpoint',
    render: (log, styles) => (
      <Text as="p" weight="medium" className={styles?.endpoint}>
        {log.endpoint}
      </Text>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (log, styles) => (
      <Text as="p" weight="bold" className={styles?.status} data-tone={statusTone(log.statusCode)}>
        {log.statusCode}
      </Text>
    ),
  },
  {
    key: 'duration',
    label: 'Duration',
    render: (log, styles) => (
      <Text as="p" size="sm" weight="medium" color="secondary" className={styles?.cell}>
        {formatDuration(log.durationMs)}
      </Text>
    ),
  },
  {
    key: 'requestSize',
    label: 'Req. Size',
    render: (log, styles) => (
      <Text as="p" size="sm" weight="medium" color="muted" className={styles?.cell}>
        {formatSize(log.requestSize)}
      </Text>
    ),
  },
  {
    key: 'responseSize',
    label: 'Res. Size',
    render: (log, styles) => (
      <Text as="p" size="sm" weight="medium" color="muted" className={styles?.cell}>
        {formatSize(log.responseSize)}
      </Text>
    ),
  },
  {
    key: 'timestamp',
    label: 'Timestamp',
    render: (log, styles) => (
      <Text as="p" size="sm" weight="medium" color="muted" className={styles?.cell}>
        {new Date(log.timestamp).toLocaleString('sv-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </Text>
    ),
  },
];
