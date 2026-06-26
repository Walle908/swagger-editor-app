import { type ReactNode } from 'react';
import Link from 'next/link';
import { Text } from '@/components/ui';
import styles from './MainPageView.module.scss';

export function MainPageView(): ReactNode {
  return (
    <div className={styles.pageContainer}>
      {' '}
      <Text as="h1" color="accent" size="xl">
        Main Page
      </Text>
      <Link href="/about">About us</Link>
      <Link href="/signup">Sign up</Link>
      <Link href="/signin">Sign in</Link>
    </div>
  );
}
