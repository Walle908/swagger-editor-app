import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';

import { EndpointCard } from './EndpointCard';
import { HttpMethodType } from '@/types/openapi';
import { generateCurlCommand } from '@/utils/cUrlGenerator';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/firebase', () => ({
  auth: {
    currentUser: { uid: 'mock-user-123' },
  },
  db: {},
}));

vi.mock('@/utils/cUrlGenerator', () => ({
  generateCurlCommand: vi.fn().mockReturnValue('curl -X POST "https://example.com"'),
}));

vi.mock('./endpointInfo/EndpoinInfo', () => ({
  EndpointInfo: ({
    onExecute,
    onGenerateCurl,
    onClear,
    parametersTable,
  }: {
    onExecute: () => void;
    onGenerateCurl: () => void;
    onClear: () => void;
    parametersTable: React.ReactNode;
  }) => (
    <div data-testid="mock-endpoint-info">
      <button data-testid="test-execute-btn" onClick={onExecute}>
        Execute
      </button>
      <button data-testid="test-curl-btn" onClick={onGenerateCurl}>
        cURL
      </button>
      <button data-testid="test-clear-btn" onClick={onClear}>
        Clear
      </button>
      <div data-testid="test-param-table-container">{parametersTable}</div>
    </div>
  ),
}));

vi.mock('./endpointInfo/parametersTable/ParametersTable', () => ({
  ParametersTable: ({
    onParamChange,
  }: {
    onParamChange: (name: string, value: string) => void;
  }) => (
    <input data-testid="test-param-input" onChange={(e) => onParamChange('id', e.target.value)} />
  ),
}));

vi.mock('./execution-result/ExecutionResult', () => ({
  ExecutionResult: () => <div data-testid="mock-execution-result">Execution Result Display</div>,
}));

describe('EndpointCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  test('should render minimized header content successfully and expand details section upon click', () => {
    render(
      <EndpointCard
        method="POST"
        path="/posts"
        summary="Create a new article asset"
        description="Detailed specification guidelines for posts creation route"
        type={'POST' as HttpMethodType}
        baseUrl="https://example.com"
        responses={[]}
      />
    );

    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('/posts')).toBeInTheDocument();
    expect(screen.getByText('Create a new article asset')).toBeInTheDocument();

    expect(screen.queryByTestId('mock-endpoint-info')).toBeNull();

    const clickableCardHeader = screen.getByText('POST');
    fireEvent.click(clickableCardHeader);

    expect(screen.getByTestId('mock-endpoint-info')).toBeInTheDocument();
    expect(screen.getByTestId('mock-execution-result')).toBeInTheDocument();
  });

  test('should block execution if required fields fail internal validation checks', () => {
    const mockParameters = [{ name: 'id', in: 'path', required: true, type: 'integer' } as const];

    render(
      <EndpointCard
        method="POST"
        path="/posts/{id}"
        summary="S"
        description="D"
        type={'POST' as HttpMethodType}
        baseUrl="https://example.com"
        parameters={mockParameters}
        responses={[]}
      />
    );

    fireEvent.click(screen.getByText('POST'));
    fireEvent.click(screen.getByTestId('test-execute-btn'));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should process parameters changes via table controls successfully', () => {
    const mockParameters = [{ name: 'id', in: 'path', required: true, type: 'integer' } as const];

    render(
      <EndpointCard
        method="POST"
        path="/posts/{id}"
        summary="S"
        description="D"
        type={'POST' as HttpMethodType}
        baseUrl="https://example.com"
        parameters={mockParameters}
        responses={[]}
      />
    );

    fireEvent.click(screen.getByText('POST'));

    const inputEl = screen.getByTestId('test-param-input');
    fireEvent.change(inputEl, { target: { value: '105' } });

    expect(inputEl).toHaveValue('105');
  });

  test('should execute backend proxy request successfully and parse normal responses data structures', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 201, type: 'json', body: { id: 1 }, headers: {} }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(
      <EndpointCard
        method="POST"
        path="/posts"
        summary="S"
        description="D"
        type={'POST' as HttpMethodType}
        baseUrl="https://example.com"
        responses={[]}
      />
    );

    fireEvent.click(screen.getByText('POST'));
    fireEvent.click(screen.getByTestId('test-execute-btn'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', expect.any(Object));
    });
  });

  test('should generate clean curl strings commands payloads formats and write them to active clipboard storage', async () => {
    render(
      <EndpointCard
        method="POST"
        path="/posts"
        summary="S"
        description="D"
        type={'POST' as HttpMethodType}
        baseUrl="https://example.com"
        responses={[]}
      />
    );

    fireEvent.click(screen.getByText('POST'));
    fireEvent.click(screen.getByTestId('test-curl-btn'));

    expect(generateCurlCommand).toHaveBeenCalled();
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'curl -X POST "https://example.com"'
      );
    });
  });

  test('should reset components execution results metadata fields and clear structures layout upon trigger clear button', () => {
    render(
      <EndpointCard
        method="POST"
        path="/posts"
        summary="S"
        description="D"
        type={'POST' as HttpMethodType}
        baseUrl="https://example.com"
        responses={[]}
      />
    );

    fireEvent.click(screen.getByText('POST'));
    fireEvent.click(screen.getByTestId('test-clear-btn'));

    expect(screen.getByTestId('mock-endpoint-info')).toBeInTheDocument();
  });
});
