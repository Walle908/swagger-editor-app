import {
  HttpMethodType,
  ParameterInLocation,
  OpenAPIParameterData,
  OpenAPISchema,
} from '@/types/openapi';
import { LangType } from '@/types/types';

export interface ParsedResponseData {
  code: string;
  description: string;
  format: LangType;
  example?: string;
  schemaRaw?: string;
}

export interface CleanEndpoint {
  id: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  type: HttpMethodType;
  parameters?: OpenAPIParameterData[] | null;
  requestBodyFormat?: LangType;
  requestBodyExample?: string;
  requestBodySchema?: string;
  responses: ParsedResponseData[];
}

function getExampleAndSchema(contentNode: unknown): {
  format: LangType;
  text: string;
  schemaStr: string;
} {
  const result = { format: 'json' as LangType, text: '', schemaStr: '' };

  if (!contentNode || typeof contentNode !== 'object') return result;
  const content = contentNode as Record<string, unknown>;

  const mediaKey =
    'application/json' in content ? 'application/json' : 'text/yaml' in content ? 'text/yaml' : '';
  if (!mediaKey) return result;

  const mediaNode = content[mediaKey] as Record<string, unknown> | undefined;
  if (!mediaNode || typeof mediaNode !== 'object') return result;

  result.format = mediaKey === 'text/yaml' ? 'yaml' : 'json';

  if (mediaNode.schema) {
    result.schemaStr = JSON.stringify(mediaNode.schema, null, 2);
  }

  let rawExample: unknown = undefined;

  if (mediaNode.example !== undefined) {
    rawExample = mediaNode.example;
  } else if (mediaNode.schema && typeof mediaNode.schema === 'object') {
    const schema = mediaNode.schema as Record<string, unknown>;
    if (schema.example !== undefined) {
      rawExample = schema.example;
    } else if (
      'properties' in schema &&
      schema.properties &&
      typeof schema.properties === 'object'
    ) {
      const props = schema.properties as Record<string, Record<string, unknown>>;
      const mockObj: Record<string, unknown> = {};
      Object.entries(props).forEach(([k, v]) => {
        if (v && typeof v === 'object') {
          const innerProp = v as Record<string, unknown>;
          mockObj[k] =
            innerProp.example !== undefined ? innerProp.example : `[${innerProp.type || 'string'}]`;
        }
      });
      rawExample = mockObj;
    } else if (
      schema.type === 'array' &&
      'items' in schema &&
      schema.items &&
      typeof schema.items === 'object'
    ) {
      const itemsObj = schema.items as Record<string, unknown>;
      if (
        'properties' in itemsObj &&
        itemsObj.properties &&
        typeof itemsObj.properties === 'object'
      ) {
        const props = itemsObj.properties as Record<string, Record<string, unknown>>;
        const mockItem: Record<string, unknown> = {};
        Object.entries(props).forEach(([k, v]) => {
          if (v && typeof v === 'object') {
            const innerProp = v as Record<string, unknown>;
            mockItem[k] =
              innerProp.example !== undefined
                ? innerProp.example
                : `[${innerProp.type || 'string'}]`;
          }
        });
        rawExample = [mockItem];
      }
    }
  }

  if (rawExample !== undefined) {
    result.text =
      result.format === 'json' ? JSON.stringify(rawExample, null, 2) : String(rawExample);
  }

  return result;
}

export function parseAndGroupSchema(
  schema: OpenAPISchema | null | undefined,
  noSummaryText: string,
  noDescriptionText: string
): Record<string, CleanEndpoint[]> {
  const groups: Record<string, CleanEndpoint[]> = {};

  if (!schema || !schema.paths) return groups;

  Object.entries(schema.paths).forEach(([path, pathMethods]) => {
    if (!pathMethods || typeof pathMethods !== 'object') return;

    const commonParameters =
      'parameters' in pathMethods && Array.isArray(pathMethods.parameters)
        ? pathMethods.parameters
        : [];

    Object.entries(pathMethods).forEach(([method, operation]) => {
      if (!operation || typeof operation !== 'object' || method === 'parameters') return;

      const lowerMethod = method.toLowerCase();
      const validMethods = ['get', 'post', 'put', 'delete', 'patch'];
      if (!validMethods.includes(lowerMethod)) return;

      const finalType = lowerMethod as HttpMethodType;

      const methodParameters =
        'parameters' in operation && Array.isArray(operation.parameters)
          ? operation.parameters
          : [];
      const rawParameters = [...commonParameters, ...methodParameters];

      const formattedParameters: OpenAPIParameterData[] = rawParameters.map((item) => {
        if (!item || typeof item !== 'object') return { name: '', in: 'query', required: false };
        const p = item as Record<string, unknown>;
        const pSchema =
          p.schema && typeof p.schema === 'object' ? (p.schema as Record<string, unknown>) : null;

        return {
          name: typeof p.name === 'string' ? p.name : '',
          in: (p.in as ParameterInLocation) || 'query', // Тут пройдут и 'header', и 'cookie'
          required: typeof p.required === 'boolean' ? p.required : false,
          type: pSchema && typeof pSchema.type === 'string' ? pSchema.type : 'string',
          default: pSchema && pSchema.default !== undefined ? String(pSchema.default) : '',
          enum: pSchema && Array.isArray(pSchema.enum) ? pSchema.enum.map(String) : undefined,
        };
      });

      let requestBodyFormat: LangType | undefined = undefined;
      let reqBodyStr = '';
      let requestBodySchemaStr: string | undefined = undefined;

      if (
        'requestBody' in operation &&
        operation.requestBody &&
        typeof operation.requestBody === 'object'
      ) {
        const rb = operation.requestBody as Record<string, unknown>;
        if ('content' in rb) {
          const rbResult = getExampleAndSchema(rb.content);
          requestBodyFormat = rbResult.format;
          reqBodyStr = rbResult.text;
          requestBodySchemaStr = rbResult.schemaStr || undefined;
        }
      }

      const formattedResponses: ParsedResponseData[] = [];
      if (
        'responses' in operation &&
        operation.responses &&
        typeof operation.responses === 'object'
      ) {
        Object.entries(operation.responses).forEach(([code, resValue]) => {
          if (!resValue || typeof resValue !== 'object') return;
          const res = resValue as Record<string, unknown>;
          const desc =
            typeof res.description === 'string' ? res.description : 'Successful operation';

          let resFormat: LangType = 'json';
          let resExampleStr = '';
          let responseSchemaStr = '';

          if ('content' in res) {
            const resResult = getExampleAndSchema(res.content);
            resFormat = resResult.format;
            resExampleStr = resResult.text;
            responseSchemaStr = resResult.schemaStr;
          }

          formattedResponses.push({
            code,
            description: desc,
            format: resFormat,
            example: resExampleStr || undefined,
            schemaRaw: responseSchemaStr || undefined,
          });
        });
      }

      const firstTag =
        'tags' in operation && Array.isArray(operation.tags) && operation.tags.length > 0
          ? operation.tags[0]
          : undefined;
      const categoryName = typeof firstTag === 'string' ? firstTag : 'default';

      groups[categoryName] = groups[categoryName] || [];
      groups[categoryName].push({
        id: `${lowerMethod}-${path}`,
        method: method.toUpperCase(),
        path: path,
        summary:
          'summary' in operation && typeof operation.summary === 'string'
            ? operation.summary
            : noSummaryText,
        description:
          'description' in operation &&
          typeof operation.description === 'string' &&
          operation.description.trim() !== ''
            ? operation.description
            : noDescriptionText,
        type: finalType,
        parameters: formattedParameters.length > 0 ? formattedParameters : null,
        requestBodyFormat,
        requestBodyExample: reqBodyStr || undefined,
        requestBodySchema: requestBodySchemaStr,
        responses: formattedResponses,
      });
    });
  });

  Object.keys(groups).forEach((category) => {
    if (!groups[category]) {
      return;
    }
    groups[category].sort((a, b) => {
      if (a.path !== b.path) {
        return a.path.localeCompare(b.path);
      }
      return a.method.localeCompare(b.method);
    });
  });

  return groups;
}
