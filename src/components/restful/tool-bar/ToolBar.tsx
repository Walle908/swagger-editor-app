import { FormatSwitcher } from './format-switcher/FormatSwitcher';
import styles from './ToolBar.module.scss';
import { Button } from '@/components/ui';
import { importSchemaFromUrl } from '@/utils/importSchema';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { useSchemaStore } from '../store/useSchemaStore';

export const ToolBar = memo(function ToolBar() {
  const format = useSchemaStore((state) => state.format);
  const error = useSchemaStore((state) => state.error);
  const toggleFormat = useSchemaStore((state) => state.toggleFormatAction);
  const setCodeAction = useSchemaStore((state) => state.setCodeAction);
  const parsedSchema = useSchemaStore((state) => state.parsedSchema);

  const t = useTranslations('MainPage.toolbar');
  const tEditor = useTranslations('MainPage.editor');

  const oasVersion = parsedSchema?.openapi || parsedSchema?.swagger;

  const handleImportClick = async () => {
    const url = prompt(
      t('promptTitle'),
      'https://raw.githubusercontent.com/sebastienlevert/jsonplaceholder-api/main/openapi.yaml'
    );

    if (!url || !url.trim()) return;

    try {
      const result = await importSchemaFromUrl(url);

      if (!result.success) {
        alert(result.error);
        if (result.textData) {
          setCodeAction(result.textData, tEditor('fallbackError'));
        }
        return;
      }
      if (result.detectedFormat && format !== result.detectedFormat) {
        toggleFormat();
      }
      if (result.textData) {
        setCodeAction(result.textData, tEditor('fallbackError'));
      }
    } catch (err) {
      console.error('Failed to fetch schema:', err);

      alert('Network Error: Failed to fetch schema. Please check your internet connection.');
    }
  };

  return (
    <section className={styles.editorToolbar}>
      <div className={styles.toolbarLeft}>
        <p className={`${styles.statusText} ${error ? styles.invalid : styles.valid}`}>
          {error ? `${t('invalidStatus')}` : t('validStatus')} {oasVersion}
        </p>
        <span className={styles.divider}></span>
        <FormatSwitcher format={format} onToggleAction={toggleFormat} />
      </div>

      <div className={styles.toolbarRight}>
        <Button color="light" className={styles.importUrlBtn} onClick={handleImportClick}>
          {t('btnImport')}
        </Button>

        <Button
          color="dark"
          className={styles.saveSpecBtn}
          onClick={() => console.log('Save Spec clicked')}>
          {t('btnSave')}
        </Button>
      </div>
    </section>
  );
});
