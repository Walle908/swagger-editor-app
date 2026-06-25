'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import Text from '@/components/ui/text/Text';
import { ErrorMessage } from '@/constants/constants';
import styles from './error.module.scss';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Uncaught error:', error);
  }, [error]);

  return (
    <div className={styles.errorWrapper}>
      <Text as="h1" color="error" size="xl">
        {ErrorMessage.BOUNDARY_ERROR}
      </Text>

      <Button className={styles.resetButton} onClick={() => reset()}>
        Reset error
      </Button>
    </div>
  );
}
