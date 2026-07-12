import { render } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { CodeEditor } from './CodeEditor';

vi.mock('../store/useSchemaStore', () => ({
  useSchemaStore: (
    selector: (state: { code: string; format: string; error: string | null }) => unknown
  ) =>
    selector({
      code: 'openapi: 3.0.0',
      format: 'yaml',
      error: 'Invalid schema error text structure',
    }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@uiw/react-codemirror', () => ({
  default: () => <div data-testid="mock-codemirror">CodeMirror Canvas Element</div>,
}));

vi.mock('@uiw/codemirror-extensions-langs', () => ({
  langs: {
    yaml: () => ({}),
    json: () => ({}),
  },
}));

describe('CodeEditor Component', () => {
  test('should render successfully and display validation errors within container layouts', () => {
    const { container, getByText } = render(React.createElement(CodeEditor, { readOnly: false }));

    expect(container.firstChild).toBeDefined();

    expect(getByText('Invalid schema error text structure')).toBeInTheDocument();
  });
});
