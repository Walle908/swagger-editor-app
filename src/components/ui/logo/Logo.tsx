import { type ReactNode, type HTMLAttributes } from 'react';
import Image from 'next/image';
import logo from 'public/logo.svg';
import { Text, LinkComponent } from '..';
import styles from './Logo.module.scss';

interface LogoProps extends HTMLAttributes<HTMLElement> {
  variant?: 'mainColor' | 'additionalColor';
}

export function Logo({ variant = 'mainColor' }: LogoProps): ReactNode {
  return (
    <LinkComponent href="/" className={styles.logoContainer}>
      <Image src={logo} alt="Swagger editor app logo" priority />
      <Text as="h1" weight="bold" className={styles[variant]}>
        OpenAPI Studio
      </Text>
    </LinkComponent>
  );
}
