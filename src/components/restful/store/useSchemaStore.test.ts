import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useSchemaStore } from './useSchemaStore';

vi.mock('@/utils/swaggerConvert', () => ({
  detectFormat: (text: string) => (text.startsWith('{') ? 'json' : 'yaml'),
  convertFormat: (format: string) => (format === 'json' ? '{"mocked": true}' : 'mocked: true'),
  validateSwagger: async () => ({ isValid: true, error: null, parsedData: {} }),
}));

describe('useSchemaStore', () => {
  beforeEach(() => {
    useSchemaStore.getState().resetAction();
  });

  test('should initialize with correct default schema configuration values', () => {
    const state = useSchemaStore.getState();

    expect(state.code).toBe('');
    expect(state.format).toBe('json');
    expect(state.error).toBeNull();
    expect(state.parsedSchema).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.debounceTimer).toBeNull();
  });

  test('should successfully clear and reset state properties when resetAction is invoked', () => {
    useSchemaStore.setState({
      code: 'openapi: 3.0.0',
      format: 'yaml',
      error: 'Mock error text structure',
    });

    useSchemaStore.getState().resetAction();
    const updatedState = useSchemaStore.getState();

    expect(updatedState.code).toBe('');
    expect(updatedState.error).toBeNull();
    expect(updatedState.parsedSchema).toBeNull();
    expect(updatedState.isLoading).toBe(false);
  });

  test('should convert valid code and update language targets when toggleFormatAction is invoked', () => {
    useSchemaStore.setState({
      code: '{"title": "Petstore API"}',
      format: 'json',
      error: null,
    });

    useSchemaStore.getState().toggleFormatAction();
    const stateAfterToggle = useSchemaStore.getState();

    expect(stateAfterToggle.format).toBe('yaml');
    expect(stateAfterToggle.code).toBe('mocked: true');
  });

  test('should completely abort format conversions if active parsing error constraints are present', () => {
    useSchemaStore.setState({
      code: 'invalid yaml syntax structure [',
      format: 'yaml',
      error: 'Syntax validation error message flag description',
    });

    useSchemaStore.getState().toggleFormatAction();
    const stateAfterAbortedToggle = useSchemaStore.getState();

    expect(stateAfterAbortedToggle.format).toBe('yaml');
    expect(stateAfterAbortedToggle.code).toBe('invalid yaml syntax structure [');
  });
});
