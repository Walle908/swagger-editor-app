'use client';

import { Input } from '@/components/ui';
import styles from './FormatSwitcher.module.scss';
import clsx from 'clsx';
import { LangType } from '@/types/types';
import { useTranslations } from 'next-intl';

interface FormatSwitcherProps {
  format: LangType;
  onToggleAction?: () => void;
}

export function FormatSwitcher({ format, onToggleAction }: FormatSwitcherProps) {
  const t = useTranslations('MainPage.toolbar');

  return (
    <div className={styles.switcherWrapper}>
      <div className={styles.segmentedControl} onClick={onToggleAction}>
        <Input
          type="text"
          value="JSON"
          variant="none"
          readOnly
          className={clsx(
            styles.segmentInput,
            format === 'json' ? styles.activeGreen : styles.inactiveWhite
          )}
        />

        <Input
          type="text"
          value="YAML"
          variant="none"
          readOnly
          className={clsx(
            styles.segmentInput,
            format === 'yaml' ? styles.activeGreen : styles.inactiveWhite
          )}
        />
      </div>

      <svg
        className={styles.convertIcon}
        xmlns="https://w3.org"
        width="24"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#78716C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="m16 3 4 4-4 4" />
        <path d="M20 7H4" />
        <path d="m8 21-4-4 4-4" />
        <path d="M4 17h16" />
      </svg>

      <p> {t('autoConvert')} </p>
    </div>
  );
}
