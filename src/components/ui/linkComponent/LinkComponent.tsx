import { Link } from '@/i18n/navigation';
import type { AnchorHTMLAttributes, ReactNode, ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import styles from './LinkComponent.module.scss';

type I18nLinkProps = ComponentPropsWithoutRef<typeof Link>;
interface LinkComponentProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof I18nLinkProps>, I18nLinkProps {
  variant?: 'baseLink' | 'pageLink' | 'buttonLink' | 'authLink';
  isActive?: true | false;
}

export function LinkComponent({
  children,
  className = '',
  href,
  variant = 'baseLink',
  isActive = false,
  ...props
}: LinkComponentProps): ReactNode {
  const combinedClasses = clsx(styles[variant], className, isActive ? styles.active : '');

  return (
    <Link className={combinedClasses} href={href} {...props}>
      {children}
    </Link>
  );
}
