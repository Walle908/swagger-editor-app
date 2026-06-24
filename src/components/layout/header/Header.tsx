'use client';

import { type ReactNode } from 'react';
import Text from '@/components/ui/text/Text';
import styles from './Header.module.scss';

export default function Header(): ReactNode {
  return (
    <header className={styles.header}>
      <Text>Header</Text>
    </header>
  );
}
