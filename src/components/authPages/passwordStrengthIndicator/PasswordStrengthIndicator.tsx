'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Text } from '@/components/ui';
import clsx from 'clsx';
import styles from './PasswordStrengthIndicator.module.scss';

interface PasswordStrengthIndicatorProps {
  value: string;
}

const getPasswordStrength = (password: string) => {
  const result = {
    hasLetter: false,
    hasDigit: false,
    hasSpecialChar: false,
    hasLength: false,
  };

  if (!password) return result;

  result.hasLetter = /[\p{L}\p{M}]/u.test(password);
  result.hasDigit = /\d/.test(password);
  result.hasSpecialChar = /[\p{P}\p{S}]/u.test(password);
  result.hasLength = password.length >= 8;

  return result;
};

export default function PasswordStrengthIndicator({
  value,
}: PasswordStrengthIndicatorProps): ReactNode {
  const t = useTranslations('PasswordIndicator');

  const strength = getPasswordStrength(value);

  return (
    <div className={styles.strengthContainer}>
      <div className={styles.rulesContainer}>
        <div className={styles.progressBarTrack}>
          <div
            className={clsx(styles.progressBarFill, strength.hasLetter ? styles.activeFill : '')}
            style={{
              width: strength.hasLetter ? '100%' : '0%',
            }}
          />
        </div>

        <Text
          as="span"
          size="xxs"
          className={strength.hasLetter ? styles.validRule : styles.invalidRule}>
          <span className={styles.iconBox}>{strength.hasLetter ? '✓' : '•'}</span>
          {t('letter')}
        </Text>
      </div>

      <div className={styles.rulesContainer}>
        <div className={styles.progressBarTrack}>
          <div
            className={clsx(styles.progressBarFill, strength.hasDigit ? styles.activeFill : '')}
            style={{
              width: strength.hasDigit ? '100%' : '0%',
            }}
          />
        </div>

        <Text
          as="span"
          size="xxs"
          className={strength.hasDigit ? styles.validRule : styles.invalidRule}>
          <span className={styles.iconBox}>{strength.hasDigit ? '✓' : '•'}</span>
          {t('digit')}
        </Text>
      </div>

      <div className={styles.rulesContainer}>
        <div className={styles.progressBarTrack}>
          <div
            className={clsx(
              styles.progressBarFill,
              strength.hasSpecialChar ? styles.activeFill : ''
            )}
            style={{
              width: strength.hasSpecialChar ? '100%' : '0%',
            }}
          />
        </div>
        <Text
          as="span"
          size="xxs"
          className={strength.hasSpecialChar ? styles.validRule : styles.invalidRule}>
          <span className={styles.iconBox}>{strength.hasSpecialChar ? '✓' : '•'}</span>
          {t('specChar')}
        </Text>
      </div>

      <div className={styles.rulesContainer}>
        <div className={styles.progressBarTrack}>
          <div
            className={clsx(styles.progressBarFill, strength.hasLength ? styles.activeFill : '')}
            style={{
              width: strength.hasLength ? '100%' : '0%',
            }}
          />
        </div>
        <Text
          as="span"
          size="xxs"
          className={strength.hasLength ? styles.validRule : styles.invalidRule}>
          <span className={styles.iconBox}>{strength.hasLength ? '✓' : '•'}</span>
          {t('minLength')}
        </Text>
      </div>
    </div>
  );
}
