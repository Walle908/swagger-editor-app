import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Text } from '@/components/ui';
import styles from './HistoryPage.module.scss';
import EmptyHistory from '@/components/history/HistoryTable/EmptyHistory/EmptyHistory';
import HistoryTable from '@/components/history/HistoryTable/HistoryTable';
import HistoryCards from '@/components/history/HistoryCards/HistoryCards';
import { buildSummaryElements, getRequestLogsForUser } from '@/utils/historyUtils';
import { RequestLog } from '@/types/historyTypes';

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const uid = cookieStore.get('uid')?.value;
  const t = await getTranslations('HistoryPage');

  if (!uid) {
    redirect('/');
  }
  let logs: RequestLog[] = [];
  let loadError: string | null = null;

  try {
    logs = await getRequestLogsForUser(uid);
  } catch (error) {
    console.error('Failed to load request history:', error);
    loadError = t('loadError');
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
