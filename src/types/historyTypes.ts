import { TextProps } from '@/components/ui/text/Text';
import { HTMLAttributes } from 'react';

export type statusToneType = 'success' | 'warning' | 'error';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestLog {
  id: string;
  userId: string;
  method: HttpMethod;
  endpoint: string;
  url: string;
  statusCode: number;
  durationMs?: number;
  requestSize?: number;
  responseSize?: number;
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
  textProps?: {
    elementType?: TextProps['as'];
    weight?: TextProps['weight'];
    font?: TextProps['font'];
    color?: TextProps['color'];
    size?: TextProps['size'];
    classNameElement?: string;
    getValueElement: (val: T) => string;
    getDataAttributes?: (val: T) => Record<string, string>;
  };

  headProps?: HTMLAttributes<HTMLElement>;
};
export type ErrorHistoryDetailPageProps = {
  label: string;
  errorMessage: string;
};
export interface FirestoreData {
  url?: string;
  userId?: string;
  method?: string;
  status?: number | string;
  statusCode?: number | string;
  durationMs?: number;
  requestSize?: number;
  responseSize?: number;
  timestamp?: string;
  errorDetails?: string | null;
}
