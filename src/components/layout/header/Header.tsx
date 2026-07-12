'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { auth } from '@/firebase';
import { onIdTokenChanged, signOut } from 'firebase/auth';
import { Logo, LinkComponent } from '@/components/ui';
import LanguageSwitcher from '@/components/languageSwitcher/LanguageSwitcher';
import ThemeSwitcher from '@/components/themeSwitcher/ThemeSwitcher';
import clsx from 'clsx';
import getInitials from '@/utils/getInitials';
import styles from './Header.module.scss';
import { setUidCookie, clearUidCookie } from '@/utils/uidCookie';

export function Header(): ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Navigation');

  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        setUserName(user.displayName);
        setUidCookie(user.uid);
      } else {
        setIsAuth(false);
        setUserName(null);
        clearUidCookie();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    document.body.classList.toggle('no-scroll', isMenuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await signOut(auth);
      closeMenu();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const headerClassName = clsx(styles.header, isScrolled && styles.scrolled);
  const menuClassName = clsx(styles.mobileMenu, isMenuOpen && styles.menuActive);
  const burgerClassName = clsx(styles.burger, isMenuOpen && styles.burgerActive);

  const pageLinks = (
    <div className={styles.pageLinks}>
      <LinkComponent href="/" variant="pageLink" isActive={pathname === '/'} onClick={closeMenu}>
        {t('editor')}
      </LinkComponent>
      <LinkComponent
        href="/about"
        variant="pageLink"
        isActive={pathname?.endsWith('/about')}
        onClick={closeMenu}>
        {t('about')}
      </LinkComponent>
    </div>
  );

  return (
    <header className={headerClassName}>
      <div className={styles.left}>
        <Logo />
        <div className={styles.desktopOnly}>{pageLinks}</div>
      </div>

      <div className={menuClassName}>
        <div className={styles.mobileOnly}>{pageLinks}</div>

        <div className={styles.switchers}>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <div className={styles.buttons}>
          {!isLoading && (
            <>
              {isAuth ? (
                <>
                  <LinkComponent
                    href="/history"
                    variant="buttonLink"
                    isActive={pathname?.endsWith('/history')}
                    onClick={closeMenu}>
                    {t('history')}
                  </LinkComponent>

                  <div className={styles.avatarBlock} title={userName || 'User'}>
                    {getInitials(userName)}
                  </div>

                  <LinkComponent
                    className="colorfull"
                    href="/"
                    variant="buttonLink"
                    onClick={handleSignOut}>
                    {t('signout')}
                  </LinkComponent>
                </>
              ) : (
                <>
                  <LinkComponent
                    href="/signin"
                    variant="buttonLink"
                    isActive={pathname?.endsWith('/signin')}
                    onClick={closeMenu}>
                    {t('signin')}
                  </LinkComponent>
                  <LinkComponent
                    className="colorfull"
                    href="/signup"
                    variant="buttonLink"
                    isActive={pathname?.endsWith('/signup')}
                    onClick={closeMenu}>
                    {t('signup')}
                  </LinkComponent>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}

      <button
        className={burgerClassName}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
