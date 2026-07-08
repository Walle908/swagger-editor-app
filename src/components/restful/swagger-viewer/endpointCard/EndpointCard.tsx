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
import { Toast, Text } from '@/components/ui';
import { generateCurlCommand } from '@/utils/cUrlGenerator';

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
  const [responseHeaders, setResponseHeaders] = useState<string>('');

  const [displayedCurl, setDisplayedCurl] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const computeTargetUrl = () => {
    let dynamicPath = path;
    const queryParams: string[] = [];

    if (parameters && parameters.length > 0) {
      parameters.forEach((param) => {
        const value = paramValues[param.name];
        if (!value || value.trim() === '') return;

        if (param.in === 'path') {
          dynamicPath = dynamicPath.replace(`{${param.name}}`, encodeURIComponent(value));
        } else if (param.in === 'query') {
          queryParams.push(`${encodeURIComponent(param.name)}=${encodeURIComponent(value)}`);
        }
      });
    }

    let finalUrl = `${baseUrl}${dynamicPath}`;
    if (queryParams.length > 0) {
      finalUrl += `?${queryParams.join('&')}`;
    }
    return finalUrl;
  };

  const handleExecute = async () => {
    try {
      setResponseBody('Loading...');
      setResponseHeaders('');
      setResponseStatus(null);

      const targetUrl = computeTargetUrl();
      const customHeaders: Record<string, string> = {};
      const customCookies: string[] = [];

      parameters?.forEach((param) => {
        const value = paramValues[param.name];
        if (!value || value.trim() === '') return;

        if (param.in === 'header') {
          customHeaders[param.name] = value;
        } else if (param.in === 'cookie') {
          customCookies.push(`${param.name}=${value}`);
        }
      });

      if (customCookies.length > 0) {
        customHeaders['Cookie'] = customCookies.join('; ');
      }

      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: targetUrl,
          method: method.toUpperCase(),
          headers: customHeaders,
          body: requestBodyExample || null,
        }),
      });

      const data = await res.json();

      setResponseStatus(res.status);
      setResponseHeaders(JSON.stringify(data.headers || {}, null, 2));
      setResponseBody(
        typeof data.body === 'object' ? JSON.stringify(data.body, null, 2) : data.body
      );
    } catch (err) {
      console.error(err);
      setResponseStatus(500);
      setResponseBody('Proxy Fetch Error: Failed to process request');
    }
  };

  const handleGenerateCurl = () => {
    const curlCommand = generateCurlCommand({
      method,
      path,
      baseUrl,
      parameters,
      paramValues,
      requestBodyExample,
      requestBodyFormat,
    });

    setDisplayedCurl(curlCommand);
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(curlCommand)
        .then(() => {
          setToastType('success');
          setToastMessage(t('curlCopiedSuccess') || 'cURL command copied to clipboard!');
        })
        .catch((err) => {
          console.error('Clipboard copy failed: ', err);
          setToastType('error');
          setToastMessage('Failed to copy to clipboard');
        });
    }
  };

  const handleClear = () => {
    const cleared: Record<string, string> = {};
    parameters?.forEach((p) => {
      cleared[p.name] = '';
    });
    setParamValues(cleared);
    setResponseBody('');
    setResponseHeaders('');
    setResponseStatus(null);
    setDisplayedCurl('');
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

          {displayedCurl && (
            <div className={styles.curlDisplayContainer} style={{ marginTop: '1.5rem' }}>
              <h4 className={styles.responseTitle}>Generated cURL:</h4>
              <pre
                className={styles.responsePre}
                style={{
                  backgroundColor: '#1e1e1e',
                  color: '#f8f8f2',
                  padding: '1.2rem',
                  borderRadius: '6px',
                  overflowX: 'auto',
                }}>
                <Text as="code" font="code" size="xs" color="secondary">
                  {displayedCurl}
                </Text>
              </pre>
            </div>
          )}

          {responseBody && (
            <div className={styles.responseContainer}>
              <h4 className={styles.responseTitle}>
                {t('responsesLabel')} {responseStatus && `[STATUS: ${responseStatus}]`}
              </h4>

              {responseHeaders && (
                <details style={{ marginBottom: '1rem', cursor: 'pointer' }}>
                  <summary
                    style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary, #666)' }}>
                    View Response Headers
                  </summary>
                  <pre className={styles.responsePre} style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                    {responseHeaders}
                  </pre>
                </details>
              )}

              <pre className={styles.responsePre}>{responseBody}</pre>
            </div>
          )}
        </div>
      )}
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
