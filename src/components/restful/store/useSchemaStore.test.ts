import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { useSchemaStore } from './useSchemaStore';
import * as swaggerConvert from '@/utils/swaggerConvert';
import { type MockedFunction } from 'vitest';
import { type OpenAPISchema } from '@/types/openapi';

vi.mock('@/utils/swaggerConvert', () => ({
  detectFormat: vi.fn((text: string) => (text.trim().startsWith('{') ? 'json' : 'yaml')),
  convertFormat: vi.fn((_code: string, format: string) =>
    format === 'json' ? '{"mocked": true}' : 'mocked: true'
  ),
  validateSwagger: vi.fn(),
}));

const mockValidateSwagger = swaggerConvert.validateSwagger as MockedFunction<
  typeof swaggerConvert.validateSwagger
>;

describe('useSchemaStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSchemaStore.getState().resetAction();
    vi.clearAllMocks();

    mockValidateSwagger.mockResolvedValue({
      isValid: true,
      error: null,
      parsedData: { info: { title: 'Mocked API', version: '1.0.0' } } as OpenAPISchema,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
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

  test('should immediately reset schema and error state properties if an empty string value is passed', () => {
    useSchemaStore.setState({
      code: 'openapi: 3.0.0',
      error: 'Some old error structure',
      parsedSchema: { info: { title: 'Old spec', version: '1.0.0' } } as OpenAPISchema,
    });

    useSchemaStore.getState().setCodeAction('   ', 'Fallback error message string layout');
    const state = useSchemaStore.getState();

    expect(state.code).toBe('   ');
    expect(state.error).toBeNull();
    expect(state.parsedSchema).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  test('should immediately turn off isLoading indicator and abort execution if the code value matches current state code', () => {
    useSchemaStore.setState({
      code: 'openapi: 3.0.0',
      isLoading: true,
    });

    useSchemaStore.getState().setCodeAction('openapi: 3.0.0', 'Fallback Error');
    const state = useSchemaStore.getState();

    expect(state.isLoading).toBe(false);
  });

  test('should trigger debounce timer, clear existing timeouts tokens, and resolve parsed data formats arrays accurately', async () => {
    useSchemaStore.getState().setCodeAction('openapi: 3.0.0', 'Fallback Error');
    let state = useSchemaStore.getState();

    expect(state.isLoading).toBe(true);
    expect(state.code).toBe('openapi: 3.0.0');
    expect(state.format).toBe('yaml');
    expect(state.debounceTimer).not.toBeNull();

    const initialTimer = state.debounceTimer;

    useSchemaStore.getState().setCodeAction('{"openapi": "3.0.0"}', 'Fallback Error');
    state = useSchemaStore.getState();

    expect(state.format).toBe('json');
    expect(state.debounceTimer).not.toBe(initialTimer);

    await vi.runAllTimersAsync();

    state = useSchemaStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.parsedSchema).toEqual({ info: { title: 'Mocked API', version: '1.0.0' } });
  });

  test('should fall back to detailed internal validate errors if validation schemas flags return false state status', async () => {
    mockValidateSwagger.mockResolvedValue({
      isValid: false,
      error: 'YAMLException: bad indentation structure definition line 5',
      parsedData: null,
    });

    useSchemaStore.getState().setCodeAction('invalid: yaml:', 'Global Fallback Error');

    await vi.runAllTimersAsync();

    const state = useSchemaStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.parsedSchema).toBeNull();
    expect(state.error).toBe('YAMLException: bad indentation structure definition line 5');
  });

  test('should safely apply global fallback error text structures if validation promises reject completely', async () => {
    mockValidateSwagger.mockRejectedValue(new Error('Fatal breakdown'));

    useSchemaStore
      .getState()
      .setCodeAction('critical syntax structure', 'Global Fallback Error System Layout');

    await vi.runAllTimersAsync();

    const state = useSchemaStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.parsedSchema).toBeNull();
    expect(state.error).toBe('Global Fallback Error System Layout');
  });
});
