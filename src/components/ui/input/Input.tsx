import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  className?: string;
  variant: 'checkbox' | 'search';
}

export default function Input({ className = '', variant, ...props }: InputProps): ReactNode {
  const variantClass = styles[variant] ? styles[variant] : '';
  const combinedClasses = clsx(variantClass, className);

  return <input className={combinedClasses} {...props} />;
}
