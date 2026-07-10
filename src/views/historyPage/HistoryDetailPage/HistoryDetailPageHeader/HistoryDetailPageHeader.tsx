import { Text } from '@/components/ui';
import { getMethodKey } from '@/utils/historyUtils';
import styles from './HistoryDetailPageHeader.module.scss';
import { RequestLog } from '@/types/historyTypes';

const HistoryDetailPageHeader = ({ log }: { log: RequestLog }) => {
  return (
    <div className={styles.header}>
      <Text
        as="span"
        weight="bold"
        size="xxs"
        font="code"
        className={styles.methodBadge}
        data-method={getMethodKey(log.method)}>
        {log.method}
      </Text>
      <Text as="h1" size="md" weight="bold" className={styles.url}>
        {log.url}
      </Text>
    </div>
  );
};

export default HistoryDetailPageHeader;
