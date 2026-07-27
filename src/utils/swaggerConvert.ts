import * as yaml from 'js-yaml';
import SwaggerParser from '@apidevtools/swagger-parser';
import { LangType } from '@/types/types';
import { OpenAPISchema, ParameterInLocation } from '@/types/openapi';

interface ValidationResult {
  isValid: boolean;
  error: string | null;
  parsedData: OpenAPISchema | null;
}

export function detectFormat(value: string): LangType {
  const data = value.trim();
  if (!data) return 'json';
  if (data.startsWith('{') || data.startsWith('[')) {
    return 'json';
  }
  return 'yaml';
}

export function convertFormat(value: string, format: LangType): string {
  const data = value.trim();
  if (!data) return '';

  try {
    const parsedObj = yaml.load(data);
    if (typeof parsedObj !== 'object' || parsedObj === null) return value;

    if (format === 'json') {
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

    const api = (await SwaggerParser.validate(JSON.parse(JSON.stringify(parsed)))) as OpenAPISchema;

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

export function isValidParameterLocation(value: string): value is ParameterInLocation {
  return ['path', 'query', 'header', 'cookie'].includes(value);
}
