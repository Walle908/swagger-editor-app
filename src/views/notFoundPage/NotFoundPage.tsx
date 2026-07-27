'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Text, LinkComponent } from '@/components/ui';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage(): ReactNode {
  const t = useTranslations('NotFound');

  return (
    <div className={styles.notFoundContainer}>
      <Text size="xl" weight="bold">
        {t('title')}
      </Text>
      <Text as="h1" color="error" size="xxl">
        {t('message')}
      </Text>
      <LinkComponent variant="buttonLink" className="colorfull" href="/">
        {t('link')}
      </LinkComponent>
    </div>
  );
}
