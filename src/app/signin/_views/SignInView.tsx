import { type ReactNode } from 'react';
import Link from 'next/link';
import { Text } from '@/components/ui';
import styles from './SignInView.module.scss';

export function SignInView(): ReactNode {
  return (
    <div className={styles.signInContainer}>
      <Text as="h1" color="accent" size="xl">
        Sign up
      </Text>
      <Link href="/">Go to main page</Link>
    </div>
  );
}
