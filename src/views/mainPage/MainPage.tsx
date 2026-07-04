'use client';

import styles from './MainPage.module.scss';
import { CodeEditor, SwaggerViewer, ToolBar } from '@/components/restful';
import { TEXT } from '@/constants/constants';
import { useState, useEffect } from 'react';
import 'swagger-ui-react/swagger-ui.css';
import { convertFormat, detectFormat, validateSwagger } from '@/utils/swaggerConvert';
import { LangType } from '@/types/types';
import { OpenAPISchema } from '@/types/openapi';

const MainPage: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [format, setFormat] = useState<LangType>('json');
  const [error, setError] = useState<string | null>(null);
  const [parsedSchema, setParsedSchema] = useState<OpenAPISchema | null>(null);

  const handleCodeChange = (newValue: string) => {
    setCode(newValue);

    if (!newValue.trim()) {
      setError(null);
      setParsedSchema(null);
      return;
    }
    const detectedData = detectFormat(newValue);
    setFormat(detectedData);
  };

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
        setError(result.error || 'error validate schema');
        setParsedSchema(null);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [code]);

  const handleFormatToggle = () => {
    if (error) {
      return;
    }
    const nextFormat = format === 'json' ? 'yaml' : 'json';
    const convertedCode = convertFormat(code, nextFormat);

    setCode(convertedCode);
    setFormat(nextFormat);
  };

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
        texts={TEXT.toolbar}
        onUrlImport={(content) => handleCodeChange(content)}
      />

      <div className={styles.splitScreenContainer}>
        <CodeEditor
          readOnly={false}
          value={code}
          height="100%"
          lang={format === 'json' ? 'json' : 'yaml'}
          onChangeAction={handleCodeChange}
          error={error}
          texts={TEXT.editor}
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
