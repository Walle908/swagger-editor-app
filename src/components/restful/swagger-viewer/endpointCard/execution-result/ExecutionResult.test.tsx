import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { ExecutionResult } from './ExecutionResult';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <code>{children}</code>,
}));

describe('ExecutionResult Component', () => {
  test('should return null and render nothing if both cURL and response body are completely empty', () => {
    const { container } = render(
      <ExecutionResult displayedCurl="" responseBody="" responseHeaders="" responseStatus={null} />
    );

    expect(container.firstChild).toBeNull();
  });

  test('should successfully display сURL command snippets and safe response code headers', () => {
    render(
      <ExecutionResult
        displayedCurl='curl -X GET "https://example.com"'
        responseBody='{"success": true}'
        responseHeaders='{"content-type": "application/json"}'
        responseStatus={200}
      />
    );

    expect(screen.getByText('generatedCurlLabel')).toBeInTheDocument();
    expect(screen.getByText('responsesLabel')).toBeInTheDocument();
    expect(screen.getByText('viewHeadersLabel')).toBeInTheDocument();
    expect(screen.getByText('curl -X GET "https://example.com"')).toBeInTheDocument();
    expect(screen.getByText('{"success": true}')).toBeInTheDocument();
    expect(screen.getByText('{"content-type": "application/json"}')).toBeInTheDocument();

    expect(screen.getByText('[STATUS: 200]')).toBeInTheDocument();
  });
});
