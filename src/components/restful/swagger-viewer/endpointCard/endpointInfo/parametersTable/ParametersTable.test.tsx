import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';

import { ParametersTable } from './ParametersTable';
import { OpenAPIParameterData } from '@/types/openapi';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('ParametersTable Component', () => {
  test('should return null and render nothing if the parameters array parameter is completely empty', () => {
    const { container } = render(
      <ParametersTable parameters={[]} paramValues={{}} onParamChange={vi.fn()} />
    );

    expect(container.innerHTML).toBe('');
  });

  test('should successfully display text input inputs and handle dynamic data modification change triggers', () => {
    const mockOnParamChange = vi.fn();
    const mockParameters: OpenAPIParameterData[] = [
      { name: 'username', in: 'query', required: true, type: 'string' },
    ];
    const mockParamValues = { username: 'test_user' };

    render(
      <ParametersTable
        parameters={mockParameters}
        paramValues={mockParamValues}
        onParamChange={mockOnParamChange}
      />
    );

    expect(screen.getByText('thName')).toBeInTheDocument();
    expect(screen.getByText('thIn')).toBeInTheDocument();
    expect(screen.getByText('thValue')).toBeInTheDocument();

    expect(screen.getByText('username')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('query')).toBeInTheDocument();

    const inputElement = screen.getByDisplayValue('test_user');
    expect(inputElement).toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value: 'new_user_value' } });
    expect(mockOnParamChange).toHaveBeenCalledWith('username', 'new_user_value');
  });

  test('should mount custom select layouts with dynamic options if enum arrays exist', () => {
    const mockOnParamChange = vi.fn();
    const mockEnumParameters: OpenAPIParameterData[] = [
      { name: 'status', in: 'query', required: false, type: 'string', enum: ['active', 'pending'] },
    ];
    const mockParamValues = { status: 'active' };

    render(
      <ParametersTable
        parameters={mockEnumParameters}
        paramValues={mockParamValues}
        onParamChange={mockOnParamChange}
      />
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();

    fireEvent.change(selectElement, { target: { value: 'pending' } });
    expect(mockOnParamChange).toHaveBeenCalledWith('status', 'pending');
  });
});
