export type HttpMethodType = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type ParameterInLocation = 'path' | 'query' | 'header' | 'cookie';
export interface OpenAPIInfo {
  title: string;
  version: string;
  description?: string;
}
export interface OpenAPIServer {
  url: string;
  description?: string;
}

export interface OpenAPIParameterData {
  name: string;
  in: ParameterInLocation;
  required?: boolean;
  type?: string;
  default?: string;
  enum?: string[];
}

export interface OpenAPIOperation {
  summary?: string;
  description?: string;
  parameters?: unknown[];
  responses?: Record<string, unknown>;
  tags?: string[];
}

export interface OpenAPISchema {
  openapi?: string;
  swagger?: string;
  info: OpenAPIInfo;
  servers?: OpenAPIServer[];
  paths: Record<string, Record<string, OpenAPIOperation>>;
}

export interface CleanEndpoint {
  id: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  type: HttpMethodType;
  parameters: OpenAPIParameterData[];
  requestBodyExample?: string;
  responses: Record<string, { desc: string; example?: string }>;
}
