'use client';
import { useState } from 'react';
import styles from './LanguageSwitcher.module.scss';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en');

  return (
    <div className={styles.langContainer}>
      {languages.map((lang) => (
        <label key={lang.code} className={styles.langLabel}>
          <input
            type="radio"
            name="language"
            value={lang.code}
            checked={currentLang === lang.code}
            onChange={() => setCurrentLang(lang.code)}
            className={styles.radioInput}
          />

          <span className={styles.customButton}>{lang.label}</span>
        </label>
      ))}
    </div>
  );
}
