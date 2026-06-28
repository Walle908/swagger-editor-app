import { TEXT } from '@/constants/constants';
import { FormatSwitcher } from './format-switcher/FormatSwitcher';
import styles from './ToolBar.module.scss';

interface ToolBarProps {
  format: 'JSON' | 'YAML';
  setFormat: React.Dispatch<React.SetStateAction<'JSON' | 'YAML'>>;
  error: string | null;
  texts: typeof TEXT.toolbar;
}

export function ToolBar({ format, setFormat, error, texts }: ToolBarProps) {
  return (
    <section className={styles.editorToolbar}>
      <div className={styles.toolbarLeft}>
        <p className={`${styles.statusText} ${error ? styles.invalid : styles.valid}`}>
          {error ? `${texts.invalidStatus} · ${format.toLowerCase()}` : texts.validStatus}
        </p>
        <span className={styles.divider}></span>
        <FormatSwitcher
          format={format}
          onToggleAction={() => setFormat(format === 'JSON' ? 'YAML' : 'JSON')}
        />
      </div>

      <div className={styles.toolbarRight}>
        <button
          type="button"
          className={styles.importUrlBtn}
          onClick={() => console.log('Import URL clicked')}>
          {texts.btnImport}
        </button>

        <button
          type="button"
          className={styles.saveSpecBtn}
          onClick={() => console.log('Save Spec clicked')}>
          {texts.btnSave}
        </button>
      </div>
    </section>
  );
}
