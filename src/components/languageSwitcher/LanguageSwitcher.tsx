'use client';

import { type ChangeEvent } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import styles from './LanguageSwitcher.module.scss';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextLocale = event.target.value as Locale;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className={styles.langContainer}>
      {languages.map((lang) => (
        <label key={lang.code} className={styles.langLabel}>
          <input
            type="radio"
            name="language"
            value={lang.code}
            checked={locale === lang.code}
            onChange={onChange}
            className={styles.radioInput}
          />

          <span className={styles.customButton}>{lang.label}</span>
        </label>
      ))}
    </div>
  );
}
