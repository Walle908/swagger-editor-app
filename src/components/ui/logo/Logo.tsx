import { type ReactNode } from 'react';
import Image from 'next/image';
import { Text, LinkComponent } from '..';
import styles from './Logo.module.scss';

export function Logo(): ReactNode {
  return (
    <LinkComponent href="/" className={styles.logoContainer}>
      <Image src="/logo.svg" alt="Swagger editor app logo" width={30} height={30} priority />
      <Text as="h1" weight="bold">
        OpenAPI Studio
      </Text>
    </LinkComponent>
  );
}
