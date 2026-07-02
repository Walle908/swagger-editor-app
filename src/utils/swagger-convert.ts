import * as yaml from 'js-yaml';
import SwaggerParser from '@apidevtools/swagger-parser';

interface ValidationResult {
  isValid: boolean;
  error: string | null;
  parsedData: unknown;
}

export function detectFormat(value: string): 'JSON' | 'YAML' {
  const data = value.trim();
  if (!data) return 'JSON';
  if (data.startsWith('{') || data.startsWith('[')) {
    return 'JSON';
  }
  return 'YAML';
}

export function convertFormat(value: string, format: 'JSON' | 'YAML'): string {
  const data = value.trim();
  if (!data) return '';

  try {
    const parsedObj = yaml.load(data);
    if (typeof parsedObj !== 'object' || parsedObj === null) return value;

    if (format === 'JSON') {
      return JSON.stringify(parsedObj, null, 2);
    } else {
      return yaml.dump(parsedObj, { indent: 2 });
    }
  } catch {
    return value;
  }
}

export async function validateSwagger(value: string): Promise<ValidationResult> {
  const data = value.trim();
  if (!data) {
    return { isValid: false, error: 'schema is empty', parsedData: null };
  }

  try {
    const parsed = yaml.load(data);

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Data must be ob (JSON или YAML)');
    }

    const api: unknown = await SwaggerParser.validate(JSON.parse(JSON.stringify(parsed)));

    return { isValid: true, error: null, parsedData: api };
  } catch (err: unknown) {
    let errorMessage = 'error validate schema';

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return {
      isValid: false,
      error: errorMessage,
      parsedData: null,
    };
  }
}
