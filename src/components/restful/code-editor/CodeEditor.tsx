import { langs } from '@uiw/codemirror-extensions-langs';
import { githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import styles from './CodeEditor.module.scss';
import { EditorView } from '@codemirror/view';
import { LangType } from '@/types/types';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useMemo } from 'react';

const codeMirrorScrollTheme = EditorView.theme({
  '&': {
    height: '100%',
  },
  '.cm-scroller': {
    overflowY: 'auto !important',
    overflowX: 'hidden !important',
  },
});

export function CodeEditor({
  readOnly,
  value = '',
  onChangeAction,
  onBlurAction,
  lang = 'json',
  fileName = 'petstore',
  error,
}: {
  readOnly: boolean;
  value?: string;
  height?: string;
  onChangeAction?: (value: string) => void;
  onBlurAction?: () => void;
  lang?: LangType;
  fileName?: string;
  error: string | null;
}) {
  const lineCount = value.trim() ? value.trim().split('\n').length : 0;

  const t = useTranslations('MainPage.editor');

  const cmExtensions = useMemo(() => {
    const extensions = [githubLight, EditorView.lineWrapping, codeMirrorScrollTheme];
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
          height="100%"
          theme={githubLight}
          style={{ height: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column' }}
          value={value}
          onChange={onChangeAction}
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
