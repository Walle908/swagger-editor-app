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
      return { success: false, error: `Server returned status ${response.status}` };
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
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Network error or failed to process the schema.' };
  }
}
