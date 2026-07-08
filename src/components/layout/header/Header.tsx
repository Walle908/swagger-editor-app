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
      } else {
        setIsAuth(false);
        setUserName(null);
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
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => document.body.classList.remove('no-scroll');
  }, [isMenuOpen]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await signOut(auth);
      setIsMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const headerClassName = clsx(styles.header, isScrolled ? styles.scrolled : '');
  const menuClassName = clsx(styles.mobileMenu, isMenuOpen && styles.menuActive);
  const burgerClassName = clsx(styles.burger, isMenuOpen && styles.burgerActive);

  return (
    <header className={headerClassName}>
      <div className={styles.left}>
        <Logo />

        <div className={styles.desktopOnly}>
          <div className={styles.pageLinks}>
            <LinkComponent href="/" variant="pageLink" isActive={pathname === '/'}>
              {t('editor')}
            </LinkComponent>
            <LinkComponent href="/about" variant="pageLink" isActive={pathname?.endsWith('/about')}>
              {t('about')}
            </LinkComponent>
          </div>
        </div>
      </div>

      <div className={menuClassName}>
        <div className={styles.mobileOnly}>
          <div className={styles.pageLinks}>
            <LinkComponent
              href="/"
              variant="pageLink"
              isActive={pathname === '/'}
              onClick={handleLinkClick}>
              {t('editor')}
            </LinkComponent>
            <LinkComponent
              href="/about"
              variant="pageLink"
              isActive={pathname?.endsWith('/about')}
              onClick={handleLinkClick}>
              {t('about')}
            </LinkComponent>
          </div>
        </div>

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
                    onClick={handleLinkClick}>
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
                    onClick={handleLinkClick}>
                    {t('signin')}
                  </LinkComponent>
                  <LinkComponent
                    className="colorfull"
                    href="/signup"
                    variant="buttonLink"
                    isActive={pathname?.endsWith('/signup')}
                    onClick={handleLinkClick}>
                    {t('signup')}
                  </LinkComponent>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />}

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
