'use client';

import styles from './MainPage.module.scss';
import { CodeEditor, SwaggerViewer, ToolBar } from '@/components/restful';
import { TEXT } from '@/constants/constants';
import { useState, useEffect } from 'react';
import 'swagger-ui-react/swagger-ui.css';
import { convertFormat, detectFormat } from '@/utils/swagger-convert';
import * as yaml from 'js-yaml';

const MainPage: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [format, setFormat] = useState<'JSON' | 'YAML'>('JSON');
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = (newValue: string) => {
    setCode(newValue);

    if (!newValue.trim()) {
      setError(null);
      return;
    }
    const detectedData = detectFormat(newValue);
    setFormat(detectedData);
  };

  useEffect(() => {
    if (!code.trim()) return;

    const delayDebounce = setTimeout(() => {
      try {
        yaml.load(code);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [code]);

  const handleFormatToggle = () => {
    if (error) {
      return;
    }
    const nextFormat = format === 'JSON' ? 'YAML' : 'JSON';
    const convertedCode = convertFormat(code, nextFormat);

    setCode(convertedCode);
    setFormat(nextFormat);
  };

  return (
    <div className={styles.mainPageLayout}>
      <ToolBar
        format={format}
        setFormat={() => handleFormatToggle()}
        error={error}
        texts={TEXT.toolbar}
      />

      <div className={styles.splitScreenContainer}>
        <CodeEditor
          readOnly={false}
          value={code}
          height="100%"
          lang={format === 'JSON' ? 'json' : 'yaml'}
          onChangeAction={handleCodeChange}
          error={error}
          texts={TEXT.editor}
        />
        <SwaggerViewer
          title={undefined}
          version={undefined}
          oasVersion={undefined}
          baseUrl={undefined}
        />
      </div>
    </div>
  );
};

export default MainPage;
