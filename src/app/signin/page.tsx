import { type ReactNode } from 'react';
import Link from 'next/link';
import Text from '@/components/ui/text/Text';
import styles from '@/styles/signInPage.module.scss';

export default function SignInPage(): ReactNode {
  return (
    <div className={styles.signInPageWrapper}>
      <Text as="h1" color="accent" size="xl">
        Sign up
      </Text>
      <Link href="/">Go to main page</Link>
    </div>
  );
}
