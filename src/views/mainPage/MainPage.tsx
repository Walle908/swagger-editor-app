'use client';

import styles from './MainPage.module.scss';
import { CodeEditor, SwaggerViewer, ToolBar } from '@/components/restful';
import 'swagger-ui-react/swagger-ui.css';
import { useSchemaStore } from '@/components/restful/store/useSchemaStore';

const MainPage: React.FC = () => {
  const parsedSchema = useSchemaStore((state) => state.parsedSchema);
  const isLoading = useSchemaStore((state) => state.isLoading);

  const viewerTitle = parsedSchema?.info?.title;
  const viewerVersion = parsedSchema?.info?.version;
  const viewerOasVersion = parsedSchema?.openapi || parsedSchema?.swagger;
  const viewerBaseUrl = parsedSchema?.servers?.[0]?.url;

  return (
    <div className={styles.mainPageLayout}>
      <ToolBar />
      <div className={styles.splitScreenContainer}>
        <CodeEditor readOnly={false} />
        <SwaggerViewer
          title={viewerTitle}
          version={viewerVersion}
          oasVersion={viewerOasVersion}
          baseUrl={viewerBaseUrl}
          schema={parsedSchema}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MainPage;
