import { type ReactNode } from 'react';
import styles from './Loader.module.scss';

export default function Loader(): ReactNode {
  return <div className={styles.loader} data-testid="loader-element"></div>;
}
