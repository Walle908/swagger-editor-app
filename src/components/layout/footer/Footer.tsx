'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';
import LinkComponent from '@/components/ui/linkComponent/LinkComponent';
import rsLogo from 'public/rss-logo.svg';
import styles from './Footer.module.scss';

export function Footer(): ReactNode {
  return (
    <footer className={styles.footer}>
      <LinkComponent href="https://rs.school/" target="_blank" rel="noreferrer">
        <Image src={rsLogo} width={45} alt="RS School" priority />
      </LinkComponent>

      <LinkComponent
        href="https://github.com/Walle908/swagger-editor-app"
        target="_blank"
        rel="noreferrer">
        © 2026 OpenAPI Studio
      </LinkComponent>

      <LinkComponent href="/about">About</LinkComponent>
    </footer>
  );
}
