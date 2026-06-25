import { type ReactNode } from 'react';
import Link from 'next/link';
import Text from '@/components/ui/text/Text';
import styles from './signup.module.scss';

export default function SignUpPage(): ReactNode {
  return (
    <div className={styles.signUpWrapper}>
      <Text as="h1" color="accent" size="xl">
        Sign up
      </Text>
      <Link href="/">Go to main page</Link>
    </div>
  );
}
