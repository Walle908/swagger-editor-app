import { type ReactNode } from 'react';
import Link from 'next/link';
import { Text } from '@/components/ui';
import styles from './NotFoundView.module.scss';

export function NotFoundView(): ReactNode {
  return (
    <div className={styles.notFoundContainer}>
      <Text size="xl" weight="bold">
        Error 404
      </Text>
      <Text as="h1" color="error" size="xl">
        Page not found
      </Text>
      <Link href="/">Go to main page</Link>
    </div>
  );
}
