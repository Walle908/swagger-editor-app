'use client';

import { useState } from 'react';
import { HttpMethodType, OpenAPIParameterData } from '@/types/openapi';
import styles from '../SwaggerViewer.module.scss';
import clsx from 'clsx';
import { EndpointInfo } from './endpointInfo/EndpoinInfo';
import { ParsedResponseData } from '@/utils/openapi';
import { LangType } from '@/types/types';

interface ExtendedParameterData extends OpenAPIParameterData {
  type?: string;
  default?: string;
  enum?: string[];
}

interface EndpointCardProps {
  method: string;
  path: string;
  summary: string;
  description: string;
  type: HttpMethodType;
  parameters?: ExtendedParameterData[] | null;
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
    setResponseBody('Кнопка Execute работает! Логика запроса будет добавлена завтра.');
  };

  const handleGenerateCurl = () => {
    alert('Кнопка Generate cURL работает! Команда появится позже.');
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

  let methodClass = styles.methodGet;
  if (type === 'post') methodClass = styles.methodPost;
  if (type === 'put') methodClass = styles.methodPut;
  if (type === 'delete') methodClass = styles.methodDelete;
  if (type === 'patch') methodClass = styles.methodPatch;

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
            parameters={parameters}
            paramValues={paramValues}
            onParamChange={handleParamChange}
            onExecute={handleExecute}
            onGenerateCurl={handleGenerateCurl}
            onClear={handleClear}
            requestBodyFormat={requestBodyFormat}
            requestBodyExample={requestBodyExample}
            requestBodySchema={requestBodySchema}
            responses={responses}
          />
          {responseBody && (
            <div className={styles.responseContainer}>
              <h4 className={styles.responseTitle}>
                RESPONSES {responseStatus && `[STATUS: ${responseStatus}]`}
              </h4>
              <pre className={styles.responsePre}>{responseBody}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
