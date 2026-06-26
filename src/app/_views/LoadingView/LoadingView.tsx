import { type ReactNode } from 'react';
import { Loader } from '@/components/ui';
import styles from './LoadingView.module.scss';

export function LoadingView(): ReactNode {
  <div className={styles.loadingContainer} role="status" aria-label="Loading">
    <Loader />;
  </div>;
  return;
}
