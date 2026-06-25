import { type ReactNode } from 'react';
import Link from 'next/link';
import Text from '@/components/ui/text/Text';
import styles from './notFound.module.scss';

export default function NotFoundPage(): ReactNode {
  return (
    <div className={styles.notFoundWrapper}>
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
