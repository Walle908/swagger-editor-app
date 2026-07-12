import { FormatSwitcher } from './format-switcher/FormatSwitcher';
import styles from './ToolBar.module.scss';
import { Button } from '@/components/ui';
import { LangType } from '@/types/types';
import { importSchemaFromUrl } from '@/utils/importSchema';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

interface ToolBarProps {
  format: LangType;
  setFormat: () => void;
  error: string | null;
  onUrlImport: (fetchedContent: string) => void;
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

  const handleImportClick = async () => {
    const url = prompt(
      t('promptTitle'),
      'https://raw.githubusercontent.com/OpenAPITools/openapi-generator/master/modules/openapi-generator/src/test/resources/3_0/petstore.json'
    );

    if (!url || !url.trim()) return;

    const result = await importSchemaFromUrl(url);

    if (!result.success) {
      alert(result.error);

      if (result.textData) {
        onUrlImport(result.textData);
      }
      return;
    }

    if (result.detectedFormat && format !== result.detectedFormat) {
      setFormat();
    }

    if (result.textData) {
      onUrlImport(result.textData);
    }
  };

  return (
    <section className={styles.editorToolbar}>
      <div className={styles.toolbarLeft}>
        <p className={`${styles.statusText} ${error ? styles.invalid : styles.valid}`}>
          {error ? `${t('invalidStatus')}` : t('validStatus')}
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
    </section>
  );
});
