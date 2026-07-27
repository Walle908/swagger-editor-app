import { LangType } from '@/types/types';
import { detectFormat, validateSwagger } from './swaggerConvert';

interface ImportSchemaResult {
  success: boolean;
  textData?: string;
  detectedFormat?: LangType;
  error?: string;
}

export async function importSchemaFromUrl(url: string): Promise<ImportSchemaResult> {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return { success: false, error: 'URL is empty' };
  }

  try {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(trimmedUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      let errorMessage = `Server returned status ${response.status}`;
      try {
        const errorData = (await response.json()) as Record<string, string>;
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        return { success: false, error: errorMessage };
      }
      return { success: false, error: errorMessage };
    }

    const textData = await response.text();

    const detectedFormat = detectFormat(textData);

    const validation = await validateSwagger(textData);

    if (!validation.isValid) {
      return {
        success: false,
        textData,
        detectedFormat,
        error: `Schema is invalid:\n${validation.error}`,
      };
    }

    return {
      success: true,
      textData,
      detectedFormat,
    };
  } catch {
    return { success: false, error: 'Network error or failed to process the schema.' };
  }
}
