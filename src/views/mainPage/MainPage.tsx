'use client';

import styles from './MainPage.module.scss';
import { CodeEditor, SwaggerViewer, ToolBar } from '@/components/restful';
import { useState, useEffect, useCallback } from 'react';
import 'swagger-ui-react/swagger-ui.css';
import { convertFormat, detectFormat, validateSwagger } from '@/utils/swaggerConvert';
import { LangType } from '@/types/types';
import { OpenAPISchema } from '@/types/openapi';
import { useTranslations } from 'next-intl';

const MainPage: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [format, setFormat] = useState<LangType>('json');
  const [error, setError] = useState<string | null>(null);
  const [parsedSchema, setParsedSchema] = useState<OpenAPISchema | null>(null);

  const t = useTranslations('MainPage');

  const handleCodeChange = useCallback((newValue: string) => {
    setCode(newValue);

    if (!newValue.trim()) {
      setError(null);
      setParsedSchema(null);
      return;
    }
    const detectedData = detectFormat(newValue);
    setFormat(detectedData);
  }, []);

  useEffect(() => {
    if (!code.trim()) {
      return;
    }

    const delayDebounce = setTimeout(async () => {
      const result = await validateSwagger(code);

      if (result.isValid && result.parsedData) {
        setError(null);
        setParsedSchema(result.parsedData);
      } else {
        setError(result.error || t('editor.fallbackError'));
        setParsedSchema(null);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [code]);

  const handleFormatToggle = useCallback(() => {
    if (error) {
      return;
    }
    const nextFormat = format === 'json' ? 'yaml' : 'json';
    const convertedCode = convertFormat(code, nextFormat);

    setCode(convertedCode);
    setFormat(nextFormat);
  }, [code, format, error]);

  const viewerTitle = parsedSchema?.info?.title;
  const viewerVersion = parsedSchema?.info?.version;
  const viewerOasVersion = parsedSchema?.openapi || parsedSchema?.swagger;
  const viewerBaseUrl = parsedSchema?.servers?.[0]?.url;

  return (
    <div className={styles.mainPageLayout}>
      <ToolBar
        format={format}
        setFormat={() => handleFormatToggle()}
        error={error}
        onUrlImport={(content) => handleCodeChange(content)}
      />

      <div className={styles.splitScreenContainer}>
        <CodeEditor
          readOnly={false}
          value={code}
          height="100%"
          lang={format}
          onChangeAction={handleCodeChange}
          error={error}
        />
        <SwaggerViewer
          title={viewerTitle}
          version={viewerVersion}
          oasVersion={viewerOasVersion}
          baseUrl={viewerBaseUrl}
          schema={parsedSchema}
        />
      </div>
    </div>
  );
};

export default MainPage;
