'use client';

import styles from './MainPage.module.scss';
import { CodeEditor, SwaggerViewer, ToolBar } from '@/components/restful';
import { useState, useEffect, useCallback } from 'react';
import 'swagger-ui-react/swagger-ui.css';
import { convertFormat, detectFormat, validateSwagger } from '@/utils/swaggerConvert';
import { LangType } from '@/types/types';
import { OpenAPISchema } from '@/types/openapi';
import { useTranslations } from 'next-intl';
import { auth } from '@/firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { getUserSpec, saveUserSpec } from '@/utils/specStorage';

const MainPage: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [format, setFormat] = useState<LangType>('json');
  const [error, setError] = useState<string | null>(null);
  const [parsedSchema, setParsedSchema] = useState<OpenAPISchema | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(true);
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
    let isCancelled = false;
    const unSubscribe = onIdTokenChanged(auth, async (user) => {
      setUserId(user?.uid ?? null);
      if (!user) {
        setIsRestoring(false);
        return;
      }
      try {
        const saved = await getUserSpec(user.uid);
        if (!isCancelled && saved) {
          setFormat(saved.format);
          setCode(saved.content);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!isCancelled) setIsRestoring(false);
      }
    });
    return () => {
      isCancelled = true;
      unSubscribe();
    };
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

  const handleSaveSpec = useCallback(async () => {
    if (!userId || error || !code.trim()) return;
    try {
      await saveUserSpec(userId, code, format);
    } catch (saveError) {
      console.error('Failed to save spec:', saveError);
    }
  }, [userId, code, format, error]);
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
        onSave={handleSaveSpec}
        isCanSave={Boolean(userId) && !error && Boolean(code.trim()) && !isRestoring}
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
