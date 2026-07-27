'use client';

import ErrorPage from '@/views/errorPage/ErrorPage';

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function GlobalErrorPage({ error, unstable_retry }: ErrorProps) {
  return (
    <html lang="en">
      <body>
        <ErrorPage
          error={error}
          unstable_retry={unstable_retry}
          retryText="Try again / Повторить попытку"
          errorMessage="Something went wrong... / Что-то пошло не так..."
        />
      </body>
    </html>
  );
}
