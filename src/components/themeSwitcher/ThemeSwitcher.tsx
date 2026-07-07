import { ReactNode, useEffect } from 'react';
import Image from 'next/image';
import moon from 'public/moon.svg';
import sunny from 'public/sunny.svg';
import styles from './ThemeSwitcher.module.scss';
import { useThemeStore } from '@/utils/themeUtils';

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
        <Image src={sunny} alt="Dark theme" priority />
      ) : (
        <Image src={moon} alt="Light theme" priority />
      )}
    </button>
  );
}
