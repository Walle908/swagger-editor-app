import { Text } from '@/components/ui';
import styles from './ErrorHistoryDetailPage.module.scss';
import { ErrorHistoryDetailPageProps } from '@/types/historyTypes';
const ErrorHistoryDetailPage = ({ label, errorMessage }: ErrorHistoryDetailPageProps) => {
  return (
    <div className={styles.errorBlock}>
      <Text as="span" size="xxs" weight="bold" font="code" color="muted">
        {label}
      </Text>
      <Text as="p" size="xs" color="error" font="code">
        {errorMessage}
      </Text>
    </div>
  );
};

export default ErrorHistoryDetailPage;
