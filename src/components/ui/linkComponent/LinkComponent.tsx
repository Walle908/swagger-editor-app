import Link, { type LinkProps } from 'next/link';
import { type AnchorHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './LinkComponent.module.scss';

interface LinkComponentProps
  extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  variant?: 'baseLink' | 'pageLink' | 'buttonLink';
}

export default function LinkComponent({
  children,
  className = '',
  href,
  variant = 'baseLink',
  ...props
}: LinkComponentProps): ReactNode {
  const combinedClasses = clsx(styles[variant], className);

  return (
    <Link className={combinedClasses} href={href} {...props}>
      {children}
    </Link>
  );
}
