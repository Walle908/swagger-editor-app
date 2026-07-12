import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Text, LinkComponent } from '@/components/ui';
import { getRequestLogById } from '@/utils/historyUtils';
import { columns } from '@/constants/historyConstants';
import styles from './HistoryDetailPage.module.scss';
import HistoryDetailPageHeader from './HistoryDetailPageHeader/HistoryDetailPageHeader';
import ErrorHistoryDetailPage from './ErrorHistoryDetailPage/ErrorHistoryDetailPage';

export default async function HistoryDetailPage({ id }: { id: string }) {
  const cookieStore = await cookies();
  const uid = cookieStore.get('uid')?.value;
  const t = await getTranslations('HistoryPage.detail');
  const tTable = await getTranslations('HistoryPage.table');
  let log = null;
  if (!uid) redirect('/');
  try {
    log = await getRequestLogById(id, uid);
  } catch (error) {
    console.error('Failed to load request details:', error);
  }
  if (!log) notFound();
  return (
    <div className={styles.detailContainer}>
      <LinkComponent href="/history" variant="baseLink" className={styles.backLink}>
        {t('backToHistory')}
      </LinkComponent>

      <HistoryDetailPageHeader log={log} />

      <div className={styles.grid}>
        {columns
          .filter((col) => col.key !== 'method')
          .map((col) => (
            <div key={col.key} className={styles.field}>
              <Text as="span" size="xs" weight="bold" font="code" color="muted">
                {tTable(col.key)}
              </Text>

              {col.textProps && (
                <Text
                  as="span"
                  size="sm"
                  weight={col.textProps.weight === 'bold' ? 'bold' : 'medium'}
                  font={col.key === 'endpoint' ? 'code' : undefined}
                  className={col.key === 'status' ? styles.statusValue : undefined}
                  {...col.textProps.getDataAttributes?.(log)}>
                  {col.textProps.getValueElement(log)}
                </Text>
              )}
            </div>
          ))}
      </div>

      {log.errorDetails && (
        <ErrorHistoryDetailPage label={t('errorDetails')} errorMessage={log.errorDetails} />
      )}
    </div>
  );
}
