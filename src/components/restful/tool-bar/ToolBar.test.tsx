import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import React from 'react';
import { ToolBar } from './ToolBar';
import { importSchemaFromUrl } from '@/utils/importSchema';

const mockToggleFormatAction = vi.fn();
const mockSetCodeAction = vi.fn();

vi.mock('../store/useSchemaStore', () => ({
  useSchemaStore: (
    selector: (state: {
      format: string;
      error: string | null;
      parsedSchema: { openapi?: string; swagger?: string } | null;
      toggleFormatAction: () => void;
      setCodeAction: () => void;
    }) => unknown
  ) =>
    selector({
      format: 'json',
      error: null,
      parsedSchema: { openapi: '3.0.0' },
      toggleFormatAction: mockToggleFormatAction,
      setCodeAction: mockSetCodeAction,
    }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/utils/importSchema', () => ({
  importSchemaFromUrl: vi.fn(),
}));

vi.mock('./format-switcher/FormatSwitcher', () => ({
  FormatSwitcher: () => <div data-testid="mock-format-switcher">FormatSwitcher Layout</div>,
}));

vi.mock('@/components/ui', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe('ToolBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('prompt', vi.fn());
    vi.stubGlobal('alert', vi.fn());
  });

  test('should render successfully and display valid OpenAPI scheme definitions version status', () => {
    render(<ToolBar />);

    expect(screen.getByText(/validStatus 3.0.0/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-format-switcher')).toBeInTheDocument();
    expect(screen.getByText('btnImport')).toBeInTheDocument();
  });

  test('should prompt the user for a web link location and process the text schema import stream upon click', async () => {
    const mockPrompt = vi.fn().mockReturnValue('https://example.com');
    vi.stubGlobal('prompt', mockPrompt);

    const mockImportSchemaFromUrl = importSchemaFromUrl as Mock;
    mockImportSchemaFromUrl.mockResolvedValue({
      success: true,
      textData: '{"openapi": "3.0.0"}',
      detectedFormat: 'json',
    });

    render(<ToolBar />);

    const importButton = screen.getByText('btnImport');
    fireEvent.click(importButton);

    expect(mockPrompt).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockImportSchemaFromUrl).toHaveBeenCalledWith('https://example.com');
      expect(mockSetCodeAction).toHaveBeenCalledWith('{"openapi": "3.0.0"}', 'fallbackError');
    });
  });
});
