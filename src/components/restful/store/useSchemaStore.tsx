import { create } from 'zustand';
import { LangType } from '@/types/types';
import { OpenAPISchema } from '@/types/openapi';
import { detectFormat, validateSwagger, convertFormat } from '@/utils/swaggerConvert';

interface SchemaState {
  code: string;
  format: LangType;
  error: string | null;
  parsedSchema: OpenAPISchema | null;
  isLoading: boolean;
  debounceTimer: NodeJS.Timeout | null;

  setCodeAction: (newValue: string, fallbackErrorMsg: string) => void;
  toggleFormatAction: () => void;
  resetAction: () => void;
}

export const useSchemaStore = create<SchemaState>((set, get) => ({
  code: '',
  format: 'json',
  error: null,
  parsedSchema: null,
  isLoading: false,
  debounceTimer: null,

  setCodeAction: (newValue: string, fallbackErrorMsg: string) => {
    const currentCode = get().code;
    const currentTimer = get().debounceTimer;

    if (newValue === currentCode) {
      set({ isLoading: false });
      return;
    }

    if (currentTimer) clearTimeout(currentTimer);

    if (!newValue.trim()) {
      set({
        code: newValue,
        error: null,
        parsedSchema: null,
        isLoading: false,
        debounceTimer: null,
      });
      return;
    }

    const detectedFormat = detectFormat(newValue);

    const newTimer = setTimeout(async () => {
      try {
        const result = await validateSwagger(newValue);
        if (result.isValid && result.parsedData) {
          set({ error: null, parsedSchema: result.parsedData });
        } else {
          set({ error: result.error || fallbackErrorMsg, parsedSchema: null });
        }
      } catch (err) {
        console.error('Критическая ошибка валидации схемы:', err);
        set({ error: fallbackErrorMsg, parsedSchema: null });
      } finally {
        set({ isLoading: false });
      }
    }, 400);

    set({
      code: newValue,
      format: detectedFormat,
      isLoading: true,
      debounceTimer: newTimer,
    });
  },

  toggleFormatAction: () => {
    const { code, format, error } = get();
    if (error) return;

    const nextFormat = format === 'json' ? 'yaml' : 'json';
    const convertedCode = convertFormat(code, nextFormat);

    set({
      code: convertedCode,
      format: nextFormat,
    });
  },

  resetAction: () => {
    const currentTimer = get().debounceTimer;
    if (currentTimer) clearTimeout(currentTimer);
    set({ code: '', error: null, parsedSchema: null, isLoading: false, debounceTimer: null });
  },
}));
