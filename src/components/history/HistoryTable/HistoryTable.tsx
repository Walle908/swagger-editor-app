import { Fragment } from 'react';
import Link from 'next/link';
import styles from './HistoryTable.module.scss';
import { RequestLog } from '@/types/historyTypes';
import { columns } from '@/utils/historyUtils';
const HistoryTable = ({ logs }: { logs: RequestLog[] }) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        {columns.map((col) => (
          <span key={col.key} {...col.headProps}>
            {col.label}
          </span>
        ))}
      </div>

      <ul className={styles.rows}>
        {logs.map((log) => (
          <li key={log.id}>
            <Link href={`/history/${log.id}`} className={styles.row}>
              {columns.map((col) => (
                <Fragment key={col.key}>{col.render(log, styles)}</Fragment>
              ))}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryTable;
