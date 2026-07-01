import { langs } from '@uiw/codemirror-extensions-langs';
import { githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import styles from './CodeEditor.module.scss';
import { EditorView } from '@codemirror/view';
import { TEXT } from '@/constants/constants';
import { LangType } from '@/types/types';
import clsx from 'clsx';

export function CodeEditor({
  readOnly,
  value = '',
  onChangeAction,
  onBlurAction,
  lang = 'json',
  fileName = 'petstore',
  error,
  texts,
}: {
  readOnly: boolean;
  value?: string;
  height?: string;
  onChangeAction?: (value: string) => void;
  onBlurAction?: () => void;
  lang?: LangType;
  fileName?: string;
  error: string | null;
  texts: typeof TEXT.editor;
}) {
  const lineCount = value.trim() ? value.trim().split('\n').length : 0;

  const codeMirrorScrollTheme = EditorView.theme({
    '&': {
      height: '100%',
    },
    '.cm-scroller': {
      overflowY: 'auto !important',
      overflowX: 'hidden !important',
    },
  });

  const cmExtensions = [githubLight, EditorView.lineWrapping, codeMirrorScrollTheme];

  if (lang !== 'text') {
    cmExtensions.push(langs[lang]());
  }

  return (
    <section className={clsx(styles.pane, styles.paneEditor)}>
      <div className={styles.ideHeader}>
        <div className={styles.fileTab}>
          <p className={styles.fileName}>
            {fileName}.{lang === 'json' ? 'json' : 'yaml'}
          </p>
        </div>
        <p className={styles.lineCount}>
          {lineCount} {texts.lines}
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
