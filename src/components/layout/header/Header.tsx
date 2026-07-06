'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Logo, LinkComponent } from '@/components/ui';
import LanguageSwitcher from '@/components/languageSwitcher/LanguageSwitcher';
import ThemeSwitcher from '@/components/themeSwitcher/ThemeSwitcher';
import styles from './Header.module.scss';
import clsx from 'clsx';

export function Header(): ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Navigation');

  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        setUserName(user.displayName);
        console.log('Данные от Firebase:', user.email, user.displayName);
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

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  const headerClassName = clsx(styles.header, isScrolled ? styles.scrolled : '');

  return (
    <header className={headerClassName}>
      <div className={styles.left}>
        <Logo />
        <div className={styles.pageLinks}>
          <LinkComponent href="/" variant="pageLink" isActive={pathname === '/'}>
            {t('editor')}
          </LinkComponent>
          <LinkComponent href="/about" variant="pageLink" isActive={pathname?.endsWith('/about')}>
            {t('about')}
          </LinkComponent>
        </div>
      </div>

      <div className={styles.right}>
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
                    variant="pageLink"
                    isActive={pathname?.endsWith('/history')}>
                    {t('history')}
                  </LinkComponent>

                  <LinkComponent
                    className="colorfull"
                    href="/"
                    variant="buttonLink"
                    onClick={handleSignOut}>
                    {t('signout')}
                  </LinkComponent>

                  {userName && <span className={styles.userGreeting}>{userName}</span>}
                </>
              ) : (
                <>
                  <LinkComponent
                    href="/signin"
                    variant="buttonLink"
                    isActive={pathname?.endsWith('/signin')}>
                    {t('signin')}
                  </LinkComponent>
                  <LinkComponent
                    className="colorfull"
                    href="/signup"
                    variant="buttonLink"
                    isActive={pathname?.endsWith('/signup')}>
                    {t('signup')}
                  </LinkComponent>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
