'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import LinkComponent from '@/components/ui/linkComponent/LinkComponent';
import Logo from '@/components/logo/Logo';
import LanguageSwitcher from '@/components/languageSwitcher/LanguageSwitcher';
import ThemeSwitcher from '@/components/themeSwitcher/ThemeSwitcher';
import styles from './Header.module.scss';

export function Header(): ReactNode {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo />
        <div className={styles.pageLinks}>
          <LinkComponent href="/" variant="pageLink" className={pathname === '/' ? 'active' : ''}>
            Editor
          </LinkComponent>
          <LinkComponent
            href="/about"
            variant="pageLink"
            className={pathname === '/about' ? 'active' : ''}>
            About
          </LinkComponent>
          <LinkComponent
            href="/history"
            variant="pageLink"
            className={pathname === '/history' ? 'active' : ''}>
            History
          </LinkComponent>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.switchers}>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <div className={styles.authButtons}>
          <LinkComponent href="/signin" variant="buttonLink">
            Sign in
          </LinkComponent>
          <LinkComponent className="colorfull" href="/signup" variant="buttonLink">
            Sign up
          </LinkComponent>
        </div>
      </div>
    </header>
  );
}
