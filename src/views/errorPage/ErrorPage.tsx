'use client';

import { type ReactNode } from 'react';
import { Button, Text } from '@/components/ui';
import styles from './ErrorPage.module.scss';

interface ErrorPageProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
  errorMessage: string;
  retryText: string;
}

export default function ErrorPage({
  unstable_retry,
  errorMessage,
  retryText,
}: ErrorPageProps): ReactNode {
  return (
    <div className={styles.errorContainer} data-testid="error-container">
      <Text as="h2" color="error" size="xl">
        {errorMessage}
      </Text>

      <Button className={styles.resetButton} onClick={() => unstable_retry()}>
        {retryText}
      </Button>
    </div>
  );
}
