import { langs } from '@uiw/codemirror-extensions-langs';
import CodeMirror from '@uiw/react-codemirror';
import styles from './CodeEditor.module.scss';
import { EditorView } from '@codemirror/view';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useSchemaStore } from '../store/useSchemaStore';

const codeMirrorScrollTheme = EditorView.theme({
  '&': {
    height: '100%',
  },
  '.cm-scroller': {
    overflowY: 'auto !important',
    overflowX: 'hidden !important',
  },
});

interface CodeEditorProps {
  readOnly: boolean;
  onBlurAction?: () => void;
  fileName?: string;
}

export function CodeEditor({ readOnly, onBlurAction, fileName = 'petstore' }: CodeEditorProps) {
  const value = useSchemaStore((state) => state.code);
  const lang = useSchemaStore((state) => state.format);
  const error = useSchemaStore((state) => state.error);
  const setCodeAction = useSchemaStore((state) => state.setCodeAction);

  const lineCount = value.trim() ? value.trim().split('\n').length : 0;

  const t = useTranslations('MainPage.editor');

  const cmExtensions = useMemo(() => {
    const extensions = [EditorView.lineWrapping, codeMirrorScrollTheme];
    if (lang === 'json' || lang === 'yaml') {
      extensions.push(langs[lang]());
    }
    return extensions;
  }, [lang]);

  return (
    <section className={clsx(styles.pane, styles.paneEditor)}>
      <div className={styles.ideHeader}>
        <div className={styles.fileTab}>
          <p className={styles.fileName}>
            {fileName}.{lang}
          </p>
        </div>
        <p className={styles.lineCount}>
          {lineCount} {t('lines')}
        </p>
      </div>

      <div className={styles.textareaWrapper}>
        {error && <div className={styles.errorIndicator}>{error}</div>}
        <CodeMirror
          onBlur={onBlurAction}
          extensions={cmExtensions}
          readOnly={readOnly}
          theme="none"
          height="100%"
          style={{ height: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column' }}
          value={value}
          onChange={(newValue) => setCodeAction(newValue, t('fallbackError'))}
          editable={!readOnly}
          basicSetup={{
            foldGutter: true,
            highlightActiveLineGutter: false,
            highlightActiveLine: false,
          }}
        />
      </div>
    </section>
  );
}
