import { ReactNode, useState } from 'react';
import Image from 'next/image';
import moon from 'public/moon.svg';
import sunny from 'public/sunny.svg';
import styles from './ThemeSwitcher.module.scss';

export default function ThemeSwitcher(): ReactNode {
  const [theme, setTheme] = useState('light');

  const toogleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const isDark = theme === 'dark';

  return (
    <button className={styles.themeBtn} onClick={toogleTheme} aria-label="Toggle theme">
      {isDark ? (
        <Image src={sunny} alt="Dark theme" priority />
      ) : (
        <Image src={moon} alt="Light theme" priority />
      )}
    </button>
  );
}
