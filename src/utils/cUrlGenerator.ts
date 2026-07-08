import { OpenAPIParameterData } from '@/types/openapi';
import { LangType } from '@/types/types';

interface GenerateCurlOptions {
  method: string;
  path: string;
  baseUrl: string;
  parameters?: OpenAPIParameterData[] | null;
  paramValues: Record<string, string>;
  requestBodyExample?: string;
  requestBodyFormat?: LangType;
}

export function generateCurlCommand({
  method,
  path,
  baseUrl,
  parameters,
  paramValues,
  requestBodyExample,
  requestBodyFormat,
}: GenerateCurlOptions): string {
  let dynamicPath = path;
  const queryParams: string[] = [];
  const headers: string[] = [];
  const cookies: string[] = [];

  if (parameters && parameters.length > 0) {
    parameters.forEach((param) => {
      const value = paramValues[param.name];
      if (!value || value.trim() === '') return;

      switch (param.in) {
        case 'path':
          dynamicPath = dynamicPath.replace(`{${param.name}}`, encodeURIComponent(value));
          break;
        case 'query':
          queryParams.push(`${encodeURIComponent(param.name)}=${encodeURIComponent(value)}`);
          break;
        case 'header':
          headers.push(`-H "${param.name}: ${value}"`);
          break;
        case 'cookie':
          cookies.push(`${param.name}=${value}`);
          break;
        default:
          break;
      }
    });
  }

  let finalUrl = `${baseUrl}${dynamicPath}`;
  if (queryParams.length > 0) {
    finalUrl += `?${queryParams.join('&')}`;
  }

  const curlParts = [`curl -X ${method.toUpperCase()} "${finalUrl}"`];

  if (requestBodyExample && requestBodyExample.trim() !== '') {
    const contentType = requestBodyFormat === 'yaml' ? 'application/yaml' : 'application/json';
    curlParts.push(`-H "Content-Type: ${contentType}"`);
  }

  if (headers.length > 0) {
    curlParts.push(...headers);
  }

  if (cookies.length > 0) {
    curlParts.push(`-H "Cookie: ${cookies.join('; ')}"`);
  }

  if (requestBodyExample && requestBodyExample.trim() !== '') {
    const escapedBody = requestBodyExample.replace(/'/g, "'\\''");
    curlParts.push(`--data '${escapedBody}'`);
  }

  return curlParts.join(' ');
}
