import { langs } from '@uiw/codemirror-extensions-langs';
import { githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import styles from './CodeEditor.module.scss';
import { TEXT } from '@/constants/constants';

export type Lang = 'json' | 'yaml' | 'text';

export function CodeEditor({
  readOnly,
  value = '',
  height = '100%',
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
  lang?: Lang;
  fileName?: string;
  error: string | null;
  texts: typeof TEXT.editor;
}) {
  const lineCount = value.trim() ? value.split('\n').length : 0;

  return (
    <section className={`${styles.pane} ${styles.paneEditor}`}>
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
        <CodeMirror
          onBlur={onBlurAction}
          extensions={lang !== 'text' ? [langs[lang](), githubLight] : [githubLight]}
          readOnly={readOnly}
          height={height}
          value={value}
          onChange={onChangeAction}
          editable={!readOnly}
          basicSetup={{
            highlightActiveLineGutter: !readOnly,
            highlightActiveLine: !readOnly,
          }}
        />
        {error && <div className={styles.errorIndicator}>{error}</div>}
      </div>
    </section>
  );
}
