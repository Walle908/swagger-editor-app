'use client';

import { useEffect, type ReactNode } from 'react';
import { Button, Text } from '@/components/ui';
import styles from './ErrorPage.module.scss';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  errorMessage: string;
  resetText: string;
}

export default function ErrorPage({
  error,
  reset,
  errorMessage,
  resetText,
}: ErrorPageProps): ReactNode {
  useEffect(() => {
    console.error('Uncaught error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <Text as="h1" color="error" size="xxl">
        {errorMessage}
      </Text>

      <Button className={styles.resetButton} onClick={() => reset()}>
        {resetText}
      </Button>
    </div>
  );
}
