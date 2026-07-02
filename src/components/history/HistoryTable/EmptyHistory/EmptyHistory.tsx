import Link from 'next/link';
import styles from './EmptyHistory.module.scss';
import clsx from 'clsx';
import { Text } from '@/components/ui';
const EmptyHistory = () => {
  return (
    <div className={styles.empty}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden>
          -
        </div>
        <Text as="h2" size="xl" weight="bold" className={styles.title}>
          No requests yet
        </Text>
        <Text as="p" size="md" color="secondary" className={styles.text}>
          You haven&apos;t executed any requests. Try an endpoint to see analytics here.
        </Text>
      </div>
      <div className={styles.actions}>
        <Link href="/" className={clsx(styles.btn, styles.editorBtn)}>
          Open Editor
        </Link>
        <Link href="/" className={clsx(styles.btn, styles.viewerBtn)}>
          Viewer
        </Link>
      </div>
    </div>
  );
};

export default EmptyHistory;
