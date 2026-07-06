'use client';

import { Button } from '@/components/ui/button/Button';
import { LangType } from '@/types/types';
import styles from './EndpointInfo.module.scss';
import { ParsedResponseData } from '@/utils/openapi';
import { useTranslations } from 'next-intl';
import { RequestBody } from './requestBody/RequestBody';
import { ResponseItem } from './responseItem/ResponseItem';
import { ReactNode } from 'react';

interface EndpointInfoProps {
  summary?: string;
  description: string;
  hasParameters: boolean;
  parametersTable: ReactNode;
  onExecute: () => void;
  onGenerateCurl: () => void;
  onClear: () => void;
  requestBodyFormat?: LangType;
  requestBodyExample?: string;
  responses: ParsedResponseData[];
  requestBodySchema?: string;
}

export function EndpointInfo({
  description,
  hasParameters,
  parametersTable,
  onExecute,
  onGenerateCurl,
  onClear,
  requestBodyFormat,
  requestBodyExample,
  responses,
  requestBodySchema,
}: EndpointInfoProps) {
  const t = useTranslations('MainPage.viewer');

  return (
    <div className={styles.endpointInfo}>
      <div className={styles.sectionBlock}>
        <h4 className={styles.sectionTitle}>{t('descriptionLabel')}</h4>
        <p className={styles.endpointDescription}>{description}</p>
      </div>

      <div className={styles.sectionBlock}>
        <h4 className={styles.sectionTitle}>{t('parametersLabel')}</h4>
        {hasParameters ? (
          parametersTable
        ) : (
          <p className={styles.endpointDescription}>{t('noParameters')}</p>
        )}
      </div>

      <RequestBody
        requestBodyFormat={requestBodyFormat}
        requestBodyExample={requestBodyExample}
        requestBodySchema={requestBodySchema}
      />

      {responses && responses.length > 0 && (
        <div className={styles.sectionBlock}>
          <h4 className={styles.sectionTitle}>{t('responsesLabel')}</h4>

          <div className={styles.swaggerResponsesTable}>
            <div className={styles.swaggerResponsesHeader}>
              <div className={styles.swaggerColCode}>{t('thCode')}</div>
              <div className={styles.swaggerColDesc}>{t('thDesc')}</div>
              <div className={styles.swaggerColLinks}>{t('thLinks')}</div>
            </div>

            {responses.map((item) => (
              <ResponseItem key={item.code} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className={styles.btnSection}>
        <Button color="primary" onClick={onExecute}>
          {t('btnExecute')}
        </Button>
        <Button color="light" onClick={onGenerateCurl}>
          {t('btnGenerate')}
        </Button>
        <div className={styles.btnSpacer} />
        <Button color="none" className={styles.clearBtnCustom} onClick={onClear}>
          {t('btnClear')}
        </Button>
      </div>
    </div>
  );
}
