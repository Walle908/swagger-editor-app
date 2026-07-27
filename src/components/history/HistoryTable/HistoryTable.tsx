import { Fragment } from 'react';
import Link from 'next/link';
import styles from './HistoryTable.module.scss';
import { RequestLog } from '@/types/historyTypes';
import { Text } from '@/components/ui';
import { columns } from '@/constants/historyConstants';
import { useTranslations } from 'next-intl';
const HistoryTable = ({ logs }: { logs: RequestLog[] }) => {
  const t = useTranslations('HistoryPage.table');
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        {columns.map((col) => (
          <Text
            key={col.key}
            as="span"
            weight="bold"
            font="code"
            color="muted"
            size="xxxs"
            className={styles.headProps}>
            {t(col.key)}
          </Text>
        ))}
      </div>

      <ul className={styles.rows}>
        {logs.map((log) => (
          <li key={log.id}>
            <Link href={`/history/${log.id}`} className={styles.row}>
              {columns.map((col) => (
                <Fragment key={col.key}>
                  {col.textProps && (
                    <div className={styles.cellRow}>
                      <span className={styles.cellLabel}>{t(col.key)}</span>
                      <Text
                        as={col.textProps.elementType ?? 'p'}
                        weight={col.textProps.weight}
                        font={col.textProps.font}
                        size={col.textProps.size}
                        className={styles[col.textProps.classNameElement ?? 'cell']}
                        {...col.textProps.getDataAttributes?.(log)}>
                        {col.textProps.getValueElement(log)}
                      </Text>
                    </div>
                  )}
                </Fragment>
              ))}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryTable;
