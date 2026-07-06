'use client';

import { type ReactNode } from 'react';
import { Text } from '@/components/ui';
import styles from './HistoryPage.module.scss';
import EmptyHistory from '@/components/history/HistoryTable/EmptyHistory/EmptyHistory';
import { mockSortedLogs, mockSummary } from '@/utils/historyUtils';
import HistoryTable from '@/components/history/HistoryTable/HistoryTable';
import HistoryCards from '@/components/history/HistoryCards/HistoryCards';
import { useTranslations } from 'next-intl';
export default function HistoryPage(): ReactNode {
  const logs = mockSortedLogs;
  const hasLogs = logs.length > 0;
  const t = useTranslations('HistoryPage');
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
        {hasLogs ? (
          <>
            <HistoryCards summary={mockSummary} />
            <HistoryTable logs={logs} />
          </>
        ) : (
          <EmptyHistory />
        )}
      </div>
    </div>
  );
}
