'use client';

import { FormatSwitcher } from './format-switcher/FormatSwitcher';
import styles from './ToolBar.module.scss';
import { Button, Toast } from '@/components/ui';
import { LangType } from '@/types/types';
import { importSchemaFromUrl } from '@/utils/importSchema';
import { useTranslations } from 'next-intl';
import { memo, useState } from 'react';

interface ToolBarProps {
  format: LangType;
  setFormat: () => void;
  error: string | null;
  onUrlImport: (fetchedContent: string, fallbackError?: string) => void;
  onSave: () => void;
  isCanSave: boolean;
}

export const ToolBar = memo(function ToolBar({
  format,
  setFormat,
  error,
  onUrlImport,
  onSave,
  isCanSave,
}: ToolBarProps) {
  const t = useTranslations('MainPage.toolbar');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleImportClick = async () => {
    const url = prompt(
      t('promptTitle'),
      'https://raw.githubusercontent.com/sebastienlevert/jsonplaceholder-api/main/openapi.yaml'
    );

    if (!url || !url.trim()) return;

    const result = await importSchemaFromUrl(url);

    if (!result.success) {
      const errorMessage = result.error || 'Failed to fetch schema';
      setToastMessage(`${t('invalidStatus')}: ${errorMessage}`);
      return;
    }

    if (result.detectedFormat && format !== result.detectedFormat) {
      setFormat();
    }

    if (result.textData) {
      onUrlImport(result.textData, '');
    }
  };

  return (
    <section className={styles.editorToolbar}>
      <div className={styles.toolbarLeft}>
        <p className={`${styles.statusText} ${error ? styles.invalid : styles.valid}`}>
          {error ? t('invalidStatus') : t('validStatus')}
        </p>
        <span className={styles.divider}></span>
        <FormatSwitcher format={format} onToggleAction={() => setFormat()} />
      </div>

      <div className={styles.toolbarRight}>
        <Button color="light" className={styles.importUrlBtn} onClick={handleImportClick}>
          {t('btnImport')}
        </Button>

        <Button color="dark" className={styles.saveSpecBtn} onClick={onSave} disabled={!isCanSave}>
          {t('btnSave')}
        </Button>
      </div>
      {toastMessage && (
        <Toast message={toastMessage} type="error" onClose={() => setToastMessage(null)} />
      )}
    </section>
  );
});
