import { getTranslations } from 'next-intl/server';
import { Text } from '@/components/ui';
import styles from './HistoryPage.module.scss';
import EmptyHistory from '@/components/history/HistoryTable/EmptyHistory/EmptyHistory';
import { buildSummaryElements, getRequestLogsForUser } from '@/utils/historyUtils';
import { RequestLog } from '@/types/historyTypes';
import dynamic from 'next/dynamic';

const HistoryTable = dynamic(() => import('@/components/history/HistoryTable/HistoryTable'));
const HistoryCards = dynamic(() => import('@/components/history/HistoryCards/HistoryCards'));

interface HistoryPageProps {
  uid: string;
}

export default async function HistoryPage({ uid }: HistoryPageProps) {
  const t = await getTranslations('HistoryPage');
  const tt = await getTranslations('HistoryPage.detail');
  let logs: RequestLog[] = [];
  let loadError: string | null = null;

  try {
    logs = await getRequestLogsForUser(uid);
  } catch {
    loadError = tt('loadError');
  }

  const summary = buildSummaryElements(logs);
  const hasLogs = logs.length > 0;

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <Text as="h1" color="main" size="xxl">
          {t('title')}
        </Text>
        <Text color="muted" size="sm">
          {t('subtitle')}
        </Text>
      </div>
      <div className={styles.content}>
        {loadError ? (
          <Text color="error" size="md">
            {loadError}
          </Text>
        ) : hasLogs ? (
          <>
            <HistoryCards summary={summary} />
            <HistoryTable logs={logs} />
          </>
        ) : (
          <EmptyHistory />
        )}
      </div>
    </div>
  );
}
