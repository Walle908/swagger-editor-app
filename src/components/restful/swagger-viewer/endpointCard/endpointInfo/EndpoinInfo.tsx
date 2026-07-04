'use client';

import { ParametersTable } from '../parametersTable/ParametersTable';
import { Button } from '@/components/ui/button/Button';
import { OpenAPIParameterData } from '@/types/openapi';
import { LangType } from '@/types/types';
import styles from './EndpointInfo.module.scss';
import { ParsedResponseData } from '@/utils/openapi';

interface ExtendedParameterData extends OpenAPIParameterData {
  type?: string;
  default?: string;
  enum?: string[];
}

interface EndpointInfoProps {
  summary?: string;
  description: string;
  parameters?: ExtendedParameterData[] | null;
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onExecute: () => void;
  onGenerateCurl: () => void;
  onClear: () => void;
  requestBodyFormat?: LangType;
  requestBodyExample?: string;
  responses: ParsedResponseData[];
  requestBodySchema?: string;
}

export function EndpointInfo({
  description,
  parameters,
  paramValues,
  onParamChange,
  onExecute,
  onGenerateCurl,
  onClear,
  requestBodyFormat,
  requestBodyExample,
  responses,
  requestBodySchema,
}: EndpointInfoProps) {
  return (
    <div className={styles.endpointInfo}>
      <div className={styles.sectionBlock}>
        <h4 className={styles.sectionTitle}>DESCRIPTION:</h4>
        <p className={styles.endpointDescription}>{description}</p>
      </div>

      <div className={styles.sectionBlock}>
        <h4 className={styles.sectionTitle}>PARAMETERS:</h4>
        {parameters && parameters.length > 0 ? (
          <ParametersTable
            parameters={parameters}
            paramValues={paramValues}
            onParamChange={onParamChange}
          />
        ) : (
          <p className={styles.endpointDescription}>No parameters</p>
        )}
      </div>

      {(requestBodyExample || requestBodySchema) && (
        <div className={styles.sectionBlock}>
          <h4 className={styles.sectionTitle}>REQUEST BODY:</h4>

          {requestBodySchema && (
            <div>
              <div className={styles.swaggerMediaTypeLabel}>Request Schema:</div>
              <pre className={styles.codeBlock}>{requestBodySchema}</pre>
            </div>
          )}

          {requestBodyExample && (
            <div>
              <div className={styles.swaggerMediaTypeLabel}>
                Example Payload (
                {requestBodyFormat === 'yaml' ? 'application/yaml' : 'application/json'}):
              </div>
              <p className={styles.codeBlock}>{requestBodyExample}</p>
            </div>
          )}
        </div>
      )}

      {responses && responses.length > 0 && (
        <div className={styles.sectionBlock}>
          <h4 className={styles.sectionTitle}>RESPONSES:</h4>

          <div className={styles.swaggerResponsesTable}>
            <div className={styles.swaggerResponsesHeader}>
              <div className={styles.swaggerColCode}>Code</div>
              <div className={styles.swaggerColDesc}>Description</div>
              <div className={styles.swaggerColLinks}>Links</div>
            </div>

            {responses.map((item) => {
              const isSuccess = String(item.code).startsWith('2');

              return (
                <div key={item.code} className={styles.swaggerResponseRow}>
                  <div className={styles.swaggerResponseMainRow}>
                    <div
                      className={isSuccess ? styles.swaggerCodeSuccess : styles.swaggerCodeError}>
                      {item.code}
                    </div>
                    <p className={styles.swaggerCodeDesc}>{item.description}</p>
                    <div className={styles.swaggerColLinks}>
                      <p className={styles.noLinksText}>No links</p>
                    </div>
                  </div>

                  {(item.example || item.schemaRaw) && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {item.schemaRaw && (
                        <>
                          <div className={styles.swaggerMediaTypeLabel}>Response Schema:</div>
                          <p className={styles.codeBlock}>{item.schemaRaw}</p>
                        </>
                      )}

                      {item.example && (
                        <>
                          <div className={styles.swaggerMediaTypeLabel}>
                            Response Example (
                            {item.format === 'yaml' ? 'application/yaml' : 'application/json'}):
                          </div>
                          <p className={styles.codeBlock}>{item.example}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.btnSection}>
        <Button color="primary" onClick={onExecute}>
          Execute
        </Button>
        <Button color="light" onClick={onGenerateCurl}>
          Generate cURL
        </Button>
        <div className={styles.btnSpacer} />
        <Button color="none" className={styles.clearBtnCustom} onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
