'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LinkComponent } from '@/components/ui';
import styles from './Footer.module.scss';

export function Footer(): ReactNode {
  const t = useTranslations('Navigation');

  return (
    <footer className={styles.footer}>
      <LinkComponent href="https://rs.school/" target="_blank" rel="noreferrer">
        <Image src="/rss-logo.svg" width={40} height={40} alt="RS School" priority />
      </LinkComponent>

      <LinkComponent
        href="https://github.com/Walle908/swagger-editor-app"
        target="_blank"
        rel="noreferrer">
        © 2026 OpenAPI Studio
      </LinkComponent>

      <LinkComponent href="/about">{t('about')}</LinkComponent>
    </footer>
  );
}
