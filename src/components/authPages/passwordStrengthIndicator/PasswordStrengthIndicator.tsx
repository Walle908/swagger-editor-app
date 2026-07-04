import { type ReactNode } from 'react';
import { Text } from '@/components/ui';
import styles from './PasswordStrengthIndicator.module.scss';
import clsx from 'clsx';

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
          Letter
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
          Digit
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
          Special char
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
          8+ chars
        </Text>
      </div>
    </div>
  );
}
