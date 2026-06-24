'use client';

import { type ReactNode } from 'react';
import Text from '@/components/ui/text/Text';
import styles from './Footer.module.scss';

export default function Footer(): ReactNode {
  return (
    <header className={styles.footer}>
      <Text>Footer</Text>
    </header>
  );
}
