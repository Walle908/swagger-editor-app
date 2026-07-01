'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Logo, LinkComponent } from '@/components/ui';
import LanguageSwitcher from '@/components/languageSwitcher/LanguageSwitcher';
import ThemeSwitcher from '@/components/themeSwitcher/ThemeSwitcher';
import styles from './Header.module.scss';
import clsx from 'clsx';

export function Header(): ReactNode {
  const pathname = usePathname();
  const isAuth = true;

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClassName = clsx(styles.header, isScrolled ? styles.scrolled : '');

  return (
    <header className={headerClassName}>
      <div className={styles.left}>
        <Logo />
        <div className={styles.pageLinks}>
          <LinkComponent href="/" variant="pageLink" isActive={pathname === '/'}>
            Editor
          </LinkComponent>
          <LinkComponent href="/about" variant="pageLink" isActive={pathname === '/about'}>
            About
          </LinkComponent>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.switchers}>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <div className={styles.buttons}>
          {isAuth ? (
            <>
              <LinkComponent href="/history" variant="pageLink" isActive={pathname === '/history'}>
                History
              </LinkComponent>

              <LinkComponent className="colorfull" href="/" variant="buttonLink">
                Sign out
              </LinkComponent>
            </>
          ) : (
            <>
              <LinkComponent href="/signin" variant="buttonLink">
                Sign in
              </LinkComponent>
              <LinkComponent className="colorfull" href="/signup" variant="buttonLink">
                Sign up
              </LinkComponent>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
