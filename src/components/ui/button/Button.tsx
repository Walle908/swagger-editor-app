import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
  className?: string;
  color?: 'primary' | 'dark' | 'light' | 'none';
  variant?: 'default' | 'icon';
}

export function Button({
  children,
  className = '',
  type = 'button',
  color = 'primary',
  variant = 'default',
  onClick,
  ...props
}: ButtonProps): ReactNode {
  const combinedClasses = clsx(styles[variant], styles[color], className);

  return (
    <button className={combinedClasses} onClick={onClick} type={type} {...props}>
      {children}
    </button>
  );
}
