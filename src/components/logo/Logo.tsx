import { type ReactNode } from 'react';
import Image from 'next/image';
import logo from 'public/logo.svg';
import { Text } from '../ui';
import styles from './Logo.module.scss';

export default function Logo(): ReactNode {
  return (
    <div className={styles.logoContainer}>
      <Image src={logo} alt="Swagger editor app logo" priority />
      <Text as="h1" weight="bold">
        OpenAPI Studio
      </Text>
    </div>
  );
}
