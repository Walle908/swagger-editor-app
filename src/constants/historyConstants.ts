import { Column, RequestLog } from '@/types/historyTypes';
import { formatDuration, formatSize, getMethodKey, getStatusTone } from '@/utils/historyUtils';

export const emptyLogs: RequestLog[] = [];
export const columns: Column<RequestLog>[] = [
  {
    key: 'method',
    label: 'Method',
    textProps: {
      size: 'xxxs',
      weight: 'bold',
      classNameElement: 'method',
      getValueElement: (el) => el.method,
      getDataAttributes: (el) => ({ 'data-method': getMethodKey(el.method) }),
    },
  },
  {
    key: 'endpoint',
    label: 'Endpoint',
    textProps: {
      size: 'xxs',
      weight: 'medium',
      classNameElement: 'endpoint',
      getValueElement: (el) => el.endpoint,
    },
  },
  {
    key: 'status',
    label: 'Status',
    textProps: {
      size: 'xxs',
      weight: 'bold',
      classNameElement: 'status',
      getValueElement: (el) => String(el.statusCode),
      getDataAttributes: (el) => ({ 'data-tone': getStatusTone(el.statusCode) }),
    },
  },
  {
    key: 'duration',
    label: 'Duration',
    textProps: {
      size: 'xxs',
      weight: 'medium',
      classNameElement: 'cell',
      getValueElement: (el) =>
        typeof el.durationMs === 'number' ? formatDuration(el.durationMs) : '-',
    },
  },
  {
    key: 'reqSize',
    label: 'Req. size',
    textProps: {
      size: 'xxs',
      weight: 'medium',
      classNameElement: 'cell',
      getValueElement: (el) =>
        typeof el.requestSize === 'number' ? formatSize(el.requestSize) : '-',
    },
  },
  {
    key: 'resSize',
    label: 'Res. size',
    textProps: {
      size: 'xxs',
      weight: 'medium',
      classNameElement: 'cell',
      getValueElement: (el) =>
        typeof el.responseSize === 'number' ? formatSize(el.responseSize) : '-',
    },
  },
  {
    key: 'timestamp',
    label: 'Timestamp',
    textProps: {
      size: 'xxs',
      weight: 'medium',
      classNameElement: 'cell',
      getValueElement: (el) =>
        new Date(el.timestamp).toLocaleString('sv-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
    },
  },
];
