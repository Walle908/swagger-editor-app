import { HTMLAttributes, ReactNode } from 'react';

export type statusToneType = 'success' | 'warning' | 'error';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestLog {
  id: string;
  userId: string;
  method: HttpMethod;
  endpoint: string;
  url: string;
  statusCode: number;
  durationMs: number;
  requestSize: number;
  responseSize: number;
  timestamp: string;
  errorDetails: string | null;
}

export interface HistorySummary {
  total: number;
  avgDurationMs: number;
  successCount: number;
  errorCount4xx: number;
  errorCount5xx: number;
}
export type Column<T> = {
  key: string;
  label: string;
  headProps?: HTMLAttributes<HTMLTableCellElement>;
  render: (log: T, styles?: Record<string, string>) => ReactNode;
};
