'use client';

import { OpenAPISchema } from '@/types/openapi';
import styles from './SwaggerViewer.module.scss';
import { EndpointCard } from './endpointCard/EndpointCard';
import { parseAndGroupSchema } from '@/utils/openapi';

interface SwaggerViewerProps {
  title?: string;
  version?: string;
  oasVersion?: string;
  baseUrl?: string;
  schema?: OpenAPISchema | null;
}

export function SwaggerViewer({
  title = 'Swagger Petstore',
  version = '1.0.27',
  oasVersion = '3.0.0',
  baseUrl = 'https://swagger.io',
  schema,
}: SwaggerViewerProps) {
  if (!schema || !schema.paths) {
    return (
      <section className={styles.rightSide}>
        <div className={styles.viewerHeader}>
          <h3>{title}</h3>
          <p className={styles.apiUrl}>{baseUrl}</p>
        </div>
        <div className={styles.viewerContent}>
          <h3 className={styles.viewerContentEmpty}>Please import or paste a valid schema.</h3>
        </div>
      </section>
    );
  }

  const groupedEndpoints = parseAndGroupSchema(schema);
  const categoriesList = Object.entries(groupedEndpoints);
  const dynamicBaseUrl = schema.servers?.[0]?.url || baseUrl;

  return (
    <section className={styles.rightSide}>
      <div className={styles.viewerHeader}>
        <div className={styles.apiTitleRow}>
          <h2>{schema.info?.title || title}</h2>
          <p className={styles.badgeVersion}>{schema.info?.version || version}</p>
          <p className={styles.badgeOas}>OAS {schema.openapi || schema.swagger || oasVersion}</p>
        </div>
        <p className={styles.apiUrl}>{dynamicBaseUrl}</p>
      </div>

      <div className={styles.viewerContent}>
        {categoriesList.map(([categoryName, endpoints]) => (
          <div key={categoryName} className={styles.apiCategoryGroup}>
            <div className={styles.categoryHeader}>
              <h3>{categoryName}</h3>
              <span
                className={categoryName === 'user' ? styles.userDescCustom : styles.categoryDesc}>
                {categoryName === 'default'
                  ? 'General operations'
                  : `Operations about ${categoryName}`}
              </span>
            </div>

            <div className={styles.methodsList}>
              {endpoints.map((endpoint) => (
                <EndpointCard
                  key={endpoint.id}
                  method={endpoint.method}
                  path={endpoint.path}
                  summary={endpoint.summary}
                  description={endpoint.description}
                  parameters={endpoint.parameters}
                  type={endpoint.type}
                  baseUrl={dynamicBaseUrl}
                  requestBodyFormat={endpoint.requestBodyFormat}
                  requestBodyExample={endpoint.requestBodyExample}
                  responses={endpoint.responses}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
