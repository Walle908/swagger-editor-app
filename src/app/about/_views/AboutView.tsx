import { type ReactNode } from 'react';
import Link from 'next/link';
import { Text } from '@/components/ui';
import styles from './AboutView.module.scss';

export function AboutView(): ReactNode {
  return (
    <div className={styles.aboutContainer}>
      <Text as="h1" color="accent" size="xl">
        About us
      </Text>
      <Link href="/">Go to main page</Link>
    </div>
  );
}
