import { type ReactNode } from 'react';
import Link from 'next/link';
import { Text } from '@/components/ui';
import styles from './SignInPage.module.scss';

export default function SignInPage(): ReactNode {
  return (
    <div className={styles.signInContainer}>
      <Text as="h1" color="accent" size="xl">
        Sign in
      </Text>
      <Link href="/">Go to main page</Link>
    </div>
  );
}
