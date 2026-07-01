import { Column, RequestLog } from '@/types/historyTypes';
import { formatDuration, formatSize, methodKey, statusTone } from '@/utils/historyUtils';
import styles from './HistoryTable.module.scss';
import { Text } from '@/components/ui';
export const columns: Column<RequestLog>[] = [
  {
    key: 'method',
    label: 'Method',
    render: (log) => (
      <Text as="p" weight="bold" className={styles.method} data-method={methodKey(log.method)}>
        {log.method}
      </Text>
    ),
  },
  {
    key: 'endpoint',
    label: 'Endpoint',
    render: (log) => (
      <Text as="p" weight="medium" className={styles.endpoint}>
        {log.endpoint}
      </Text>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (log) => (
      <Text as="p" weight="bold" className={styles.status} data-tone={statusTone(log.statusCode)}>
        {log.statusCode}
      </Text>
    ),
  },
  {
    key: 'duration',
    label: 'Duration',
    render: (log) => (
      <Text as="p" size="sm" weight="medium" color="secondary" className={styles.cell}>
        {formatDuration(log.durationMs)}
      </Text>
    ),
  },
  {
    key: 'requestSize',
    label: 'Req. Size',
    render: (log) => (
      <Text as="p" size="sm" weight="medium" color="muted" className={styles.cell}>
        {formatSize(log.requestSize)}
      </Text>
    ),
  },
  {
    key: 'responseSize',
    label: 'Res. Size',
    render: (log) => (
      <Text as="p" size="sm" weight="medium" color="muted" className={styles.cell}>
        {formatSize(log.responseSize)}
      </Text>
    ),
  },
  {
    key: 'timestamp',
    label: 'Timestamp',
    render: (log) => (
      <Text as="p" size="sm" weight="medium" color="muted" className={styles.cell}>
        {new Date(log.timestamp).toLocaleString('sv-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </Text>
    ),
  },
];
