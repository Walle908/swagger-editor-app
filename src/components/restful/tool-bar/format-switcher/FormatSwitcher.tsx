'use client';

import { Input } from '@/components/ui';
import styles from './FormatSwitcher.module.scss';

interface FormatSwitcherProps {
  format: 'JSON' | 'YAML';
  onToggleAction?: () => void;
}

export function FormatSwitcher({ format, onToggleAction }: FormatSwitcherProps) {
  return (
    <div className={styles.switcherWrapper}>
      <div className={styles.segmentedControl} onClick={onToggleAction}>
        <Input
          type="text"
          value="JSON"
          readOnly
          className={`${styles.segmentInput} ${format === 'JSON' ? styles.activeGreen : styles.inactiveWhite}`}
        />

        <Input
          type="text"
          value="YAML"
          readOnly
          className={`${styles.segmentInput} ${format === 'YAML' ? styles.activeGreen : styles.inactiveWhite}`}
        />
      </div>

      <svg
        className={styles.convertIcon}
        xmlns="http://w3.org"
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

      <p> auto-convert </p>
    </div>
  );
}
