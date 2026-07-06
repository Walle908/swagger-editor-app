'use client';

import { OpenAPIParameterData } from '@/types/openapi';
import styles from './ParametersTable.module.scss';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface ParametersTableProps {
  parameters: OpenAPIParameterData[];
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
}

export function ParametersTable({ parameters, paramValues, onParamChange }: ParametersTableProps) {
  const t = useTranslations('MainPage.viewer');

  if (!parameters || parameters.length === 0) return null;

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.editSection}>
        <div className={styles.tableHeaderFrame}>
          <div className={clsx(styles.colName, styles.tableHeaderText)}>{t('thName')}</div>
          <div className={clsx(styles.colIn, styles.tableHeaderText)}>{t('thIn')}</div>
          <div className={clsx(styles.colValue, styles.tableHeaderText)}>{t('thValue')}</div>
        </div>

        {parameters.map((param) => {
          const hasEnum = param.enum && param.enum.length > 0;
          const currentValue = paramValues[param.name] || '';

          return (
            <div key={param.name} className={styles.tableRowData}>
              <div>
                <span className={styles.paramNameText}>
                  {param.name}
                  {param.required && <span className={styles.requiredStar}>*</span>}
                </span>
              </div>

              <div>
                <span className={styles.paramInText}>{param.in}</span>
              </div>

              <div>
                <div className={styles.inputWrapper}>
                  {hasEnum ? (
                    <select
                      className={styles.paramSelect}
                      value={currentValue}
                      onChange={(e) => onParamChange(param.name, e.target.value)}>
                      {param.enum?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className={styles.paramInput}
                      placeholder={t('placeholderEnter', { name: param.name })}
                      value={currentValue}
                      onChange={(e) => onParamChange(param.name, e.target.value)}
                    />
                  )}
                  {hasEnum && <span className={styles.selectArrow}>▾</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
