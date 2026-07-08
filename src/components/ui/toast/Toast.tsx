'use client';

import { useEffect, ReactNode } from 'react';
import { Text } from './../text';

import styles from './Toast.module.scss';
import clsx from 'clsx';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}: ToastProps): ReactNode {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'error';
      case 'info':
        return 'accent';
      case 'success':
        return 'primary';
      default:
        return 'main';
    }
  };

  return (
    <div className={clsx(styles.toastNotification, styles[type])}>
      <Text as="span" color={getTextColor()} weight="normal">
        {message}
      </Text>
    </div>
  );
}
