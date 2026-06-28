'use client';

import { type ReactNode } from 'react';
import { Text } from '@/components/ui';
import styles from './Header.module.scss';
import Link from 'next/link';

export function Header(): ReactNode {
  return (
    <header className={styles.header}>
      <Text>Header</Text>
      <Link href="/about">About us</Link>
      <Link href="/signup">Sign up</Link>
      <Link href="/signin">Sign in</Link>
    </header>
  );
}
