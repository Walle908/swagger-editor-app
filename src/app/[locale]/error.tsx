'use client';

import { useTranslations } from 'next-intl';
import ErrorPage from '@/views/errorPage/ErrorPage';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('ErrorPage');

  return (
    <ErrorPage error={error} reset={reset} errorMessage={t('message')} resetText={t('reset')} />
  );
}
