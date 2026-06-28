import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  className?: string;
  variant?: 'default';
}

export function Input({ className = '', variant = 'default', ...props }: InputProps): ReactNode {
  const combinedClasses = clsx(styles.baseInput, styles[variant], className);

  return <input className={combinedClasses} {...props} />;
}
