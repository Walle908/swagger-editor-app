'use client';

import { useTranslations } from 'next-intl';
import { Text } from '@/components/ui';

import styles from '../endpointInfo/EndpointInfo.module.scss';

interface ExecutionResultProps {
  displayedCurl: string;
  responseBody: string;
  responseHeaders: string;
  responseStatus: number | null;
  responseType: 'json' | 'html' | 'text';
}

export function ExecutionResult({
  displayedCurl,
  responseBody,
  responseHeaders,
  responseStatus,
  responseType,
}: ExecutionResultProps) {
  const t = useTranslations('MainPage.viewer');
  const trimmedBody = responseBody?.trim() || '';
  const isJson =
    responseType === 'json' || trimmedBody.startsWith('{') || trimmedBody.startsWith('[');
  const isHtml = responseType === 'html' || trimmedBody.startsWith('<');

  const formatLabel = isJson ? 'application/json' : isHtml ? 'text/html' : 'text/plain';

  const isSuccess = responseStatus ? String(responseStatus).startsWith('2') : true;

  if (!displayedCurl && !responseBody) return null;

  return (
    <div className={styles.endpointInfo}>
      {displayedCurl && (
        <div className={styles.sectionBlock}>
          <h4 className={styles.sectionTitle}>{t('generatedCurlLabel')}</h4>

          <pre className={styles.codeBlock}>
            <Text as="code" font="code" size="xs" color="secondary">
              {displayedCurl}
            </Text>
          </pre>
        </div>
      )}

      {responseBody && (
        <div className={styles.sectionBlock}>
          <h4 className={styles.sectionTitle}>
            {t('responsesLabel')}
            {responseStatus && (
              <span className={isSuccess ? styles.swaggerCodeSuccess : styles.swaggerCodeError}>
                [STATUS: {responseStatus}]
              </span>
            )}
          </h4>

          {responseHeaders && (
            <details style={{ cursor: 'pointer' }}>
              <summary className={styles.swaggerMediaTypeLabel}>{t('viewHeadersLabel')}</summary>
              <pre className={styles.codeBlock}>{responseHeaders}</pre>
            </details>
          )}
          <div className={styles.swaggerMediaTypeLabel}>Response Body ({formatLabel}):</div>
          <pre
            className={styles.codeBlock}
            style={{ maxHeight: '400px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            <code>
              {typeof responseBody === 'object'
                ? JSON.stringify(responseBody, null, 2)
                : responseBody}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
