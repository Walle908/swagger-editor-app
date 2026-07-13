'use client';

import styles from './MainPage.module.scss';
import { CodeEditor, SwaggerViewer, ToolBar } from '@/components/restful';
import 'swagger-ui-react/swagger-ui.css';
import { useSchemaStore } from '@/components/restful/store/useSchemaStore';
import { auth } from '@/firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { getUserSpec, saveUserSpec } from '@/utils/specStorage';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Toast } from '@/components/ui';

const MainPage: React.FC = () => {
  const t = useTranslations('MainPage.toolbar');
  const parsedSchema = useSchemaStore((state) => state.parsedSchema);
  const error = useSchemaStore((state) => state.error);
  const code = useSchemaStore((state) => state.code);
  const format = useSchemaStore((state) => state.format);
  const setCodeAction = useSchemaStore((state) => state.setCodeAction);
  const toggleFormatAction = useSchemaStore((state) => state.toggleFormatAction);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const isLoading = useSchemaStore((state) => state.isLoading);
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
      } catch {
        return;
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
      setToastType('success');
      setToastMessage(t('saveSuccess'));
    } catch {
      setToastType('error');
      setToastMessage(t('saveError'));
    }
  }, [userId, code, format, error, t]);

  const viewerTitle = parsedSchema?.info?.title;
  const viewerVersion = parsedSchema?.info?.version;
  const viewerOasVersion = parsedSchema?.openapi || parsedSchema?.swagger;
  const viewerBaseUrl = parsedSchema?.servers?.[0]?.url ?? undefined;

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
          isLoading={isLoading}
        />
      </div>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};

export default MainPage;
