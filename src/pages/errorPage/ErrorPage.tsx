'use client';

import { useEffect, type ReactNode } from 'react';
import { Button, Text } from '@/components/ui';
import { ErrorMessage } from '@/constants/constants';
import styles from './ErrorPage.module.scss';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps): ReactNode {
  useEffect(() => {
    console.error('Uncaught error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <Text as="h1" color="error" size="xl">
        {ErrorMessage.BOUNDARY_ERROR}
      </Text>

      <Button className={styles.resetButton} onClick={() => reset()}>
        Reset error
      </Button>
    </div>
  );
}
