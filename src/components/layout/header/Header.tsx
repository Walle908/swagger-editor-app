'use client';

import { type ReactNode } from 'react';
import { Text } from '@/components/ui';
import styles from './Header.module.scss';

export function Header(): ReactNode {
  return (
    <header className={styles.header}>
      <Text>Header</Text>
    </header>
  );
}
