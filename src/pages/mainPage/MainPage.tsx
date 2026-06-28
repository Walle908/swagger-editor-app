'use client';
import React, { useState } from 'react';
import styles from './MainPage.module.scss';
import { CodeEditor, SwaggerViewer, ToolBar } from '@/components/restful';
import { TEXT } from '@/constants/constants';

export type LangType = 'json' | 'yaml' | 'text';

const MainPage: React.FC = () => {
  const [schemaText, setSchemaText] = useState('');
  const [format, setFormat] = useState<'JSON' | 'YAML'>('JSON');
  const [error] = useState<string | null>(null);

  return (
    <div className={styles.appGridLayout}>
      <ToolBar format={format} setFormat={setFormat} error={error} texts={TEXT.toolbar} />

      <div className={styles.splitScreenContainer}>
        <CodeEditor
          readOnly={false}
          value={schemaText}
          lang={format === 'JSON' ? 'json' : 'yaml'}
          onChangeAction={(value) => setSchemaText(value)}
          error={error}
          texts={TEXT.editor}
        />
        <SwaggerViewer
          title={undefined}
          version={undefined}
          oasVersion={undefined}
          baseUrl={undefined}
        />
      </div>
    </div>
  );
};

export default MainPage;
