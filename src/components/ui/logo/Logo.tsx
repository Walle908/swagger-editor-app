import { type ReactNode } from 'react';
import Image from 'next/image';
import logo from 'public/logo.svg';
import { Text, LinkComponent } from '..';
import styles from './Logo.module.scss';

export function Logo(): ReactNode {
  return (
    <LinkComponent href="/" className={styles.logoContainer}>
      <Image src={logo} alt="Swagger editor app logo" priority />
      <Text as="h1" weight="bold">
        OpenAPI Studio
      </Text>
    </LinkComponent>
  );
}
