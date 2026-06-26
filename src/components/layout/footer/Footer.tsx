'use client';

import { type ReactNode } from 'react';
import { Text } from '@/components/ui';
import styles from './Footer.module.scss';

export function Footer(): ReactNode {
  return (
    <footer className={styles.footer}>
      <Text>Footer</Text>
    </footer>
  );
}
