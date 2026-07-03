import { TEXT } from '@/constants/constants';
import { FormatSwitcher } from './format-switcher/FormatSwitcher';
import styles from './ToolBar.module.scss';
import { Button } from '@/components/ui';

interface ToolBarProps {
  format: 'JSON' | 'YAML';
  setFormat: () => void;
  error: string | null;
  texts: typeof TEXT.toolbar;
}

export function ToolBar({ format, setFormat, error, texts }: ToolBarProps) {
  return (
    <section className={styles.editorToolbar}>
      <div className={styles.toolbarLeft}>
        <p className={`${styles.statusText} ${error ? styles.invalid : styles.valid}`}>
          {error ? `${texts.invalidStatus}` : texts.validStatus}
        </p>
        <span className={styles.divider}></span>
        <FormatSwitcher format={format} onToggleAction={() => setFormat()} />
      </div>

      <div className={styles.toolbarRight}>
        <Button
          color="light"
          className={styles.importUrlBtn}
          onClick={() => console.log('Import URL clicked')}>
          {texts.btnImport}
        </Button>

        <Button
          color="dark"
          className={styles.saveSpecBtn}
          onClick={() => console.log('Save Spec clicked')}>
          {texts.btnSave}
        </Button>
      </div>
    </section>
  );
}
