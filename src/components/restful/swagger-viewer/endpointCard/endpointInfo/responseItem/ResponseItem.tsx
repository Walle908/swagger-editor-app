'use client';

import { ParsedResponseData } from '@/utils/openapi';
import styles from '../EndpointInfo.module.scss';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

interface ResponseItemProps {
  item: ParsedResponseData;
}

export const ResponseItem = memo(function ResponseItem({ item }: ResponseItemProps) {
  const t = useTranslations('MainPage.viewer');
  const isSuccess = String(item.code).startsWith('2');

  return (
    <div className={styles.swaggerResponseRow}>
      <div className={styles.swaggerResponseMainRow}>
        <div className={isSuccess ? styles.swaggerCodeSuccess : styles.swaggerCodeError}>
          {item.code}
        </div>
        <p className={styles.swaggerCodeDesc}>{item.description}</p>
        <div className={styles.swaggerColLinks}>
          <p className={styles.noLinksText}>{t('noLinks')}</p>
        </div>
      </div>

      {(item.example || item.schemaRaw) && (
        <div style={{ marginTop: '0.5rem' }}>
          {item.schemaRaw && (
            <>
              <div className={styles.swaggerMediaTypeLabel}>{t('responseSchema')}</div>
              <p className={styles.codeBlock}>{item.schemaRaw}</p>
            </>
          )}

          {item.example && (
            <>
              <div className={styles.swaggerMediaTypeLabel}>
                {t('responseExample')} (
                {item.format === 'yaml' ? 'application/yaml' : 'application/json'}):
              </div>
              <p className={styles.codeBlock}>{item.example}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
});
