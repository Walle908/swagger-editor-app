'use client';

import { type ReactNode } from 'react';
import { Loader } from '@/components/ui';
import styles from './LoadingPage.module.scss';

export default function LoadingPage(): ReactNode {
  return (
    <div className={styles.loadingContainer} role="status" aria-label="Loading">
      <Loader />
    </div>
  );
}
