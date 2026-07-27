import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import React from 'react';

import { ParsedResponseData } from '@/utils/openapi';
import { EndpointInfo } from './EndpoinInfo';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui/button/Button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock('./requestBody/RequestBody', () => ({
  RequestBody: () => <div data-testid="mock-request-body">RequestBody Layout</div>,
}));

vi.mock('./responseItem/ResponseItem', () => ({
  ResponseItem: ({ item }: { item: ParsedResponseData }) => (
    <div data-testid="mock-response-item">
      {item.code} - {item.description}
    </div>
  ),
}));

describe('EndpointInfo Component', () => {
  test('should successfully display default empty states and correctly handle interaction control triggers', () => {
    const mockOnExecute = vi.fn();
    const mockOnGenerateCurl = vi.fn();
    const mockOnClear = vi.fn();

    const mockResponses: ParsedResponseData[] = [
      { code: '200', description: 'Success response status text data', format: 'json' },
    ];

    render(
      <EndpointInfo
        description="Core technical specification instructions"
        hasParameters={false}
        parametersTable={<div data-testid="mock-params-table">Parameters Table element</div>}
        onExecute={mockOnExecute}
        onGenerateCurl={mockOnGenerateCurl}
        onClear={mockOnClear}
        responses={mockResponses}
      />
    );

    expect(screen.getByText('Core technical specification instructions')).toBeInTheDocument();
    expect(screen.getByText('descriptionLabel')).toBeInTheDocument();
    expect(screen.getByText('parametersLabel')).toBeInTheDocument();

    expect(screen.getByText('noParameters')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-params-table')).toBeNull();

    expect(screen.getByTestId('mock-request-body')).toBeInTheDocument();
    expect(screen.getByTestId('mock-response-item')).toBeInTheDocument();
    expect(screen.getByText('200 - Success response status text data')).toBeInTheDocument();

    fireEvent.click(screen.getByText('btnExecute'));
    fireEvent.click(screen.getByText('btnGenerate'));
    fireEvent.click(screen.getByText('btnClear'));

    expect(mockOnExecute).toHaveBeenCalledTimes(1);
    expect(mockOnGenerateCurl).toHaveBeenCalledTimes(1);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  test('should mount custom parameter data tables if hasParameters configuration is true', () => {
    render(
      <EndpointInfo
        description="Short specifications text context"
        hasParameters={true}
        parametersTable={<div data-testid="mock-params-table">Parameters Table element</div>}
        onExecute={vi.fn()}
        onGenerateCurl={vi.fn()}
        onClear={vi.fn()}
        responses={[]}
      />
    );

    expect(screen.getByTestId('mock-params-table')).toBeInTheDocument();
    expect(screen.queryByText('noParameters')).toBeNull();
  });
});
