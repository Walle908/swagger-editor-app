import { type ReactNode } from 'react';
import styles from './Loader.module.scss';

export function Loader(): ReactNode {
  return <div className={styles.loader} data-testid="loader-element"></div>;
}
