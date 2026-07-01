import { Fragment } from 'react';
import styles from './HistoryTable.module.scss';
import { columns } from './columnsArray';
import Link from 'next/link';
import { RequestLog } from '@/types/historyTypes';
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
                <Fragment key={col.key}>{col.render(log)}</Fragment>
              ))}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryTable;
