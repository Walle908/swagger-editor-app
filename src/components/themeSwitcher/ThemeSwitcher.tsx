import { ReactNode, useEffect } from 'react';
import Image from 'next/image';

import styles from './ThemeSwitcher.module.scss';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeSwitcher(): ReactNode {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? (
        <Image src="/sunny.svg" alt="Dark theme" width={16} height={16} priority />
      ) : (
        <Image src="/moon.svg" alt="Light theme" width={16} height={16} priority />
      )}
    </button>
  );
}
