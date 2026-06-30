'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LinkComponent from '@/components/ui/linkComponent/LinkComponent';
import Logo from '@/components/logo/Logo';
import LanguageSwitcher from '@/components/languageSwitcher/LanguageSwitcher';
import ThemeSwitcher from '@/components/themeSwitcher/ThemeSwitcher';
import styles from './Header.module.scss';

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

  const headerClassName = `${styles.header} ${isScrolled ? styles.scrolled : ''}`.trim();

  return (
    <header className={headerClassName}>
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
              <LinkComponent
                href="/history"
                variant="pageLink"
                className={pathname === '/history' ? 'active' : ''}>
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
