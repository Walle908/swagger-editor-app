'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Text } from '@/components/ui';
import styles from './Unauthorized.module.scss';

export default function UnauthorizedPage(): ReactNode {
  const t = useTranslations('Unauthorized');

  return (
    <div className={styles.container}>
      <Text size="xl" weight="bold">
        {t('title')}
      </Text>
      <Text as="h1" color="error" size="xxl">
        {t('error')}
      </Text>
      <Text>{t('message')}</Text>
    </div>
  );
}
