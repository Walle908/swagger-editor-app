import { type ReactNode } from 'react';
import Link from 'next/link';
import { Text } from '@/components/ui';
import styles from './HistoryPage.module.scss';

export default function HistoryPage(): ReactNode {
  return (
    <div className={styles.historyContainer}>
      <Text as="h1" color="accent" size="xl">
        History & Analytics
      </Text>
      <Link href="/">Go to main page</Link>
    </div>
  );
}
