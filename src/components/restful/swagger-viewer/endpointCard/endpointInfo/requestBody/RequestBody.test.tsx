import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { RequestBody } from './RequestBody';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('RequestBody Component', () => {
  test('should return null and render nothing if both request payload example and schema parameters are missing', () => {
    const { container } = render(
      <RequestBody requestBodyFormat="json" requestBodyExample="" requestBodySchema="" />
    );

    expect(container.firstChild).toBeNull();
  });

  test('should successfully display structured data layout definitions when data parameters exist', () => {
    render(
      <RequestBody
        requestBodyFormat="yaml"
        requestBodyExample="title: Hello World string context value"
        requestBodySchema="type: object\nproperties:\n  title:\n    type: string"
      />
    );

    expect(screen.getByText('requestBodyLabel')).toBeInTheDocument();
    expect(screen.getByText('requestSchema')).toBeInTheDocument();
    expect(screen.getByText(/examplePayload/i)).toBeInTheDocument();
    expect(screen.getByText(/application\/yaml/i)).toBeInTheDocument();

    expect(screen.getByText(/type:\s*object/i)).toBeInTheDocument();
    expect(screen.getByText(/properties/i)).toBeInTheDocument();
    expect(screen.getByText(/title:\s*Hello\s*World/i)).toBeInTheDocument();
  });
});
