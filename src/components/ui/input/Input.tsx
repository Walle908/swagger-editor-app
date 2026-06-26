import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  className?: string;
  variant: 'checkbox' | 'search';
}

export function Input({ className = '', variant, ...props }: InputProps): ReactNode {
  const combinedClasses = clsx(styles[variant], className);

  return <input className={combinedClasses} {...props} />;
}
