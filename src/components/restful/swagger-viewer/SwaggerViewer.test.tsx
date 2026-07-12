import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { SwaggerViewer } from './SwaggerViewer';
import { OpenAPISchema } from '@/types/openapi';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/utils/openapi', () => ({
  parseAndGroupSchema: () => ({
    PetCategory: [
      {
        id: 'get-/pets',
        method: 'GET',
        path: '/pets',
        summary: 'Mock Summary Content',
        description: 'Mock Description Content',
        type: 'get',
        parameters: null,
        responses: [],
      },
    ],
  }),
}));

vi.mock('./endpointCard/EndpointCard', () => ({
  EndpointCard: () => <div data-testid="mock-endpoint-card">EndpointCard Layout</div>,
}));

vi.mock('@/components/ui', () => ({
  Loader: () => <div data-testid="mock-loader">Loading Spinner</div>,
}));

describe('SwaggerViewer Component', () => {
  test('should display a loading layout spinner when isLoading state is true', () => {
    render(
      <SwaggerViewer title="Test Store" baseUrl="https://test.com" schema={null} isLoading={true} />
    );

    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    expect(screen.getByText('Test Store')).toBeInTheDocument();
  });

  test('should display empty placeholder text if schema object is completely blank', () => {
    render(
      <SwaggerViewer
        title="Test Store"
        baseUrl="https://test.com"
        schema={null}
        isLoading={false}
      />
    );

    expect(screen.getByText('emptyMessage')).toBeInTheDocument();
  });

  test('should successfully render categorized endpoint listings when valid schema is provided', () => {
    const mockValidSchema: OpenAPISchema = {
      openapi: '3.0.0',
      info: { title: 'Valid Petstore API', version: '1.0.0' },
      paths: {
        '/pets': {
          get: {
            responses: { '200': { description: 'Success' } },
          },
        },
      },
    };

    render(
      <SwaggerViewer
        title="Default Title"
        baseUrl="https://default.com"
        schema={mockValidSchema}
        isLoading={false}
      />
    );

    expect(screen.getByText('Valid Petstore API')).toBeInTheDocument();

    expect(screen.getByText('PetCategory')).toBeInTheDocument();

    expect(screen.getByTestId('mock-endpoint-card')).toBeInTheDocument();
  });
});
