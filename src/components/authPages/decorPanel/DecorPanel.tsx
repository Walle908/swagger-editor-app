'use client';

import { type ReactNode } from 'react';
import { Logo, Text } from '@/components/ui';
import { useTranslations } from 'next-intl';
import styles from './DecorPanel.module.scss';

export default function DecorPanel(): ReactNode {
  const t = useTranslations('DecorPanel');

  return (
    <div className={styles.container}>
      <Logo variant="additionalColor" />
      <div className={styles.textContainer}>
        <Text as="h2" color="additional" size="xl" weight="bold">
          {t('title')}
        </Text>
        <Text color="faint" size="xs">
          {t('subtitle')}
        </Text>
      </div>
    </div>
  );
}
