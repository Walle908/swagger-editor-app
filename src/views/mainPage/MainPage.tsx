'use client';

import styles from './MainPage.module.scss';
import { CodeEditor, SwaggerViewer, ToolBar } from '@/components/restful';
import 'swagger-ui-react/swagger-ui.css';
import { useSchemaStore } from '@/components/restful/store/useSchemaStore';
import { auth } from '@/firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { getUserSpec, saveUserSpec } from '@/utils/specStorage';
import { useCallback, useEffect, useState } from 'react';

const MainPage: React.FC = () => {
  const parsedSchema = useSchemaStore((state) => state.parsedSchema);
  const error = useSchemaStore((state) => state.error);
  const code = useSchemaStore((state) => state.code);
  const format = useSchemaStore((state) => state.format);
  const setCodeAction = useSchemaStore((state) => state.setCodeAction);
  const toggleFormatAction = useSchemaStore((state) => state.toggleFormatAction);

  const [userId, setUserId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(true);

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
          setCodeAction(saved.content, '');
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
  }, [setCodeAction]);

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
        setFormat={toggleFormatAction}
        error={error}
        onUrlImport={(content) => setCodeAction(content, '')}
        onSave={handleSaveSpec}
        isCanSave={Boolean(userId) && !error && Boolean(code.trim()) && !isRestoring}
      />

      <div className={styles.splitScreenContainer}>
        <CodeEditor readOnly={false} />
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
