'use client';

import { useState } from 'react';
import { HttpMethodType, OpenAPIParameterData } from '@/types/openapi';
import styles from '../SwaggerViewer.module.scss';
import clsx from 'clsx';
import { EndpointInfo } from './endpointInfo/EndpoinInfo';
import { ParsedResponseData } from '@/utils/openapi';
import { LangType } from '@/types/types';
import { useTranslations } from 'next-intl';
import { ParametersTable } from './endpointInfo/parametersTable/ParametersTable';

interface EndpointCardProps {
  method: string;
  path: string;
  summary: string;
  description: string;
  type: HttpMethodType;
  parameters?: OpenAPIParameterData[] | null;
  baseUrl: string;
  requestBodyFormat?: LangType;
  requestBodyExample?: string;
  requestBodySchema?: string;
  responses: ParsedResponseData[];
}

export function EndpointCard({
  method,
  path,
  summary,
  description,
  type,
  parameters,
  baseUrl,
  requestBodyFormat,
  requestBodyExample,
  requestBodySchema,
  responses,
}: EndpointCardProps) {
  const t = useTranslations('MainPage.viewer');

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string>('');

  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const buildFinalUrl = () => {
    return `${baseUrl}${path}`;
  };

  const handleExecute = async () => {
    buildFinalUrl();
    setResponseStatus(200);
    setResponseBody(t('executeStub'));
  };

  const handleGenerateCurl = () => {
    alert(t('curlStub'));
  };

  const handleClear = () => {
    const cleared: Record<string, string> = {};
    parameters?.forEach((p) => {
      cleared[p.name] = '';
    });
    setParamValues(cleared);
    setResponseBody('');
    setResponseStatus(null);
  };

  const classNameKey = `method${type.charAt(0).toUpperCase()}${type.slice(1)}`;
  const methodClass = styles[classNameKey] || styles.methodGet;

  const hasParameters = !!(parameters && parameters.length > 0);

  return (
    <div className={clsx(styles.methodCardWrapper, methodClass, isExpanded && styles.cardExpanded)}>
      <div className={styles.methodCard} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.methodInfoLeft}>
          <div className={styles.badgeMethod}>{method}</div>
          <span className={styles.pathText}>{path}</span>
          <span className={styles.descriptionText}>{summary}</span>
        </div>
        <div className={clsx(styles.arrowIcon, isExpanded && styles.arrowExpanded)}>⌄</div>
      </div>

      {isExpanded && (
        <div className={styles.endpointDetailsContainer}>
          <EndpointInfo
            description={description}
            hasParameters={hasParameters}
            onExecute={handleExecute}
            onGenerateCurl={handleGenerateCurl}
            onClear={handleClear}
            requestBodyFormat={requestBodyFormat}
            requestBodyExample={requestBodyExample}
            requestBodySchema={requestBodySchema}
            responses={responses}
            parametersTable={
              hasParameters ? (
                <ParametersTable
                  parameters={parameters}
                  paramValues={paramValues}
                  onParamChange={handleParamChange}
                />
              ) : null
            }
          />
          {responseBody && (
            <div className={styles.responseContainer}>
              <h4 className={styles.responseTitle}>
                {t('responsesLabel')} {responseStatus && `[STATUS: ${responseStatus}]`}
              </h4>
              <pre className={styles.responsePre}>{responseBody}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
