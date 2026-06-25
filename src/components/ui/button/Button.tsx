import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
  className?: string;
  color?: 'accent' | 'base' | 'error' | 'none';
  variant?: 'default' | 'plain';
}

export default function Button({
  children,
  className = '',
  color = 'base',
  onClick,
  type = 'button',
  variant = 'default',
  ...props
}: ButtonProps): ReactNode {
  const combinedClasses = clsx(styles[variant], styles[color], className);

  return (
    <button className={combinedClasses} onClick={onClick} type={type} {...props}>
      {children}
    </button>
  );
}
