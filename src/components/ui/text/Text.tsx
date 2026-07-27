import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Text.module.scss';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'code';
  children: ReactNode;
  className?: string;
  color?:
    | 'main'
    | 'additional'
    | 'secondary'
    | 'primary'
    | 'muted'
    | 'faint'
    | 'accent'
    | 'accent1'
    | 'black'
    | 'error';
  size?: 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  weight?: 'bold' | 'medium' | 'normal';
  font?: 'main' | 'code';
}

export function Text({
  as = 'p',
  children,
  className = '',
  color = 'main',
  size = 'sm',
  weight = 'normal',
  font = 'main',
  ...props
}: TextProps): ReactNode {
  const Tag = as;

  const combinedClasses = clsx(
    styles[size],
    styles[color],
    styles[weight],
    styles[font],
    className
  );

  return (
    <Tag className={combinedClasses} {...props}>
      {children}
    </Tag>
  );
}
