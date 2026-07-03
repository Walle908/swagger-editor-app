'use client';

import { useTranslations } from 'next-intl';
import ErrorPage from '@/views/errorPage/ErrorPage';

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function Error({ error, unstable_retry }: ErrorProps) {
  const t = useTranslations('ErrorPage');

  return (
    <ErrorPage
      error={error}
      unstable_retry={unstable_retry}
      errorMessage={t('message')}
      retryText={t('retry')}
    />
  );
}
