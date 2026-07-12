import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';

import { ResponseItem } from './ResponseItem';
import { ParsedResponseData } from '@/utils/openapi';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('ResponseItem Component', () => {
  test('should successfully display baseline metadata for successful operations and skip missing content layouts', () => {
    const mockItem: ParsedResponseData = {
      code: '200',
      description: 'Operation completed successfully text context',
      format: 'json',
    };

    render(<ResponseItem item={mockItem} />);

    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully text context')).toBeInTheDocument();
    expect(screen.getByText('noLinks')).toBeInTheDocument();

    expect(screen.queryByText('responseSchema')).toBeNull();
    expect(screen.queryByText(/responseExample/i)).toBeNull();
  });

  test('should safely display structural code schemas and raw text payload formats when fields exist', () => {
    const mockDetailedItem: ParsedResponseData = {
      code: '400',
      description: 'Bad request validation errors format layout',
      format: 'yaml',
      schemaRaw: 'type: object\nproperties:\n  error:\n    type: string',
      example: 'error: missing param validation payload structure',
    };

    render(<ResponseItem item={mockDetailedItem} />);

    expect(screen.getByText('responseSchema')).toBeInTheDocument();
    expect(screen.getByText(/responseExample/i)).toBeInTheDocument();
    expect(screen.getByText(/application\/yaml/i)).toBeInTheDocument();

    if (mockDetailedItem.schemaRaw) {
      expect(
        screen.getByText((content) =>
          content.replace(/\s+/g, ' ').includes('type: object properties: error: type: string')
        )
      ).toBeInTheDocument();
    }

    if (mockDetailedItem.example) {
      expect(
        screen.getByText((content) => content.includes('error: missing param validation'))
      ).toBeInTheDocument();
    }
  });
});
