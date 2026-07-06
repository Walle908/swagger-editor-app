'use client';

import { LangType } from '@/types/types';
import styles from '../EndpointInfo.module.scss';
import { useTranslations } from 'next-intl';

interface RequestBodyProps {
  requestBodyFormat?: LangType;
  requestBodyExample?: string;
  requestBodySchema?: string;
}

export function RequestBody({
  requestBodyFormat,
  requestBodyExample,
  requestBodySchema,
}: RequestBodyProps) {
  const t = useTranslations('MainPage.viewer');

  if (!requestBodyExample && !requestBodySchema) return null;

  return (
    <div className={styles.sectionBlock}>
      <h4 className={styles.sectionTitle}>{t('requestBodyLabel')}</h4>

      {requestBodySchema && (
        <div>
          <div className={styles.swaggerMediaTypeLabel}>{t('requestSchema')}</div>
          <pre className={styles.codeBlock}>{requestBodySchema}</pre>
        </div>
      )}

      {requestBodyExample && (
        <div>
          <div className={styles.swaggerMediaTypeLabel}>
            {t('examplePayload')} (
            {requestBodyFormat === 'yaml' ? 'application/yaml' : 'application/json'}):
          </div>
          <p className={styles.codeBlock}>{requestBodyExample}</p>
        </div>
      )}
    </div>
  );
}
