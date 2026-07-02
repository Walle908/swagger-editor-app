'use client';

import ErrorPage from '@/views/errorPage/ErrorPage';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  return (
    <html lang="en">
      <body>
        <ErrorPage
          error={error}
          reset={reset}
          resetText="Reset error /Сбросить ошибку"
          errorMessage="Something went wrong... / Что-то пошло не так..."
        />
      </body>
    </html>
  );
}
