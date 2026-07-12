import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import React from 'react';

import { importSchemaFromUrl } from '@/utils/importSchema';
import { ToolBar } from './ToolBar';

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
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),

  Toast: ({ message }: { message: string }) => <div data-testid="mock-toast">{message}</div>,
}));

describe('ToolBar Component', () => {
  const mockSetFormat = vi.fn();
  const mockOnUrlImport = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('prompt', vi.fn());
    vi.stubGlobal('alert', vi.fn());
  });

  test('should render successfully and display valid OpenAPI status labels', () => {
    render(
      <ToolBar
        format="json"
        setFormat={mockSetFormat}
        error={null}
        onUrlImport={mockOnUrlImport}
        onSave={mockOnSave}
        isCanSave={true}
      />
    );

    expect(screen.getByText('validStatus')).toBeInTheDocument();
    expect(screen.getByTestId('mock-format-switcher')).toBeInTheDocument();
    expect(screen.getByText('btnImport')).toBeInTheDocument();
    expect(screen.getByText('btnSave')).toBeInTheDocument();
  });

  test('should prompt the user for a web link location and process the text schema import', async () => {
    const mockPrompt = vi.fn().mockReturnValue('https://example.com');
    vi.stubGlobal('prompt', mockPrompt);

    const mockImportSchemaFromUrl = importSchemaFromUrl as Mock;
    mockImportSchemaFromUrl.mockResolvedValue({
      success: true,
      textData: '{"openapi": "3.0.0"}',
      detectedFormat: 'json',
    });

    render(
      <ToolBar
        format="json"
        setFormat={mockSetFormat}
        error={null}
        onUrlImport={mockOnUrlImport}
        onSave={mockOnSave}
        isCanSave={true}
      />
    );

    const importButton = screen.getByText('btnImport');
    fireEvent.click(importButton);

    expect(mockPrompt).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockImportSchemaFromUrl).toHaveBeenCalledWith('https://example.com');

      expect(mockOnUrlImport).toHaveBeenCalledWith('{"openapi": "3.0.0"}', '');
    });
  });

  test('should early return and do nothing if prompt is cancelled or empty', () => {
    vi.stubGlobal('prompt', vi.fn().mockReturnValue(''));

    render(
      <ToolBar
        format="json"
        setFormat={mockSetFormat}
        error={null}
        onUrlImport={mockOnUrlImport}
        onSave={mockOnSave}
        isCanSave={true}
      />
    );

    const importButton = screen.getByText('btnImport');
    fireEvent.click(importButton);

    expect(importSchemaFromUrl).not.toHaveBeenCalled();
  });

  test('should display a beautiful toast message if network import fails with 500 error', async () => {
    vi.stubGlobal('prompt', vi.fn().mockReturnValue('https://invalid-url.com'));

    const mockImportSchemaFromUrl = importSchemaFromUrl as Mock;
    mockImportSchemaFromUrl.mockResolvedValue({
      success: false,
      error: 'Proxy network connection failed',
    });

    render(
      <ToolBar
        format="json"
        setFormat={mockSetFormat}
        error={null}
        onUrlImport={mockOnUrlImport}
        onSave={mockOnSave}
        isCanSave={true}
      />
    );

    fireEvent.click(screen.getByText('btnImport'));

    await waitFor(() => {
      expect(screen.getByTestId('mock-toast')).toBeInTheDocument();
      expect(screen.getByTestId('mock-toast')).toHaveTextContent(
        'invalidStatus: Proxy network connection failed'
      );
    });
  });

  test('should trigger onSave callback when save button is clicked', () => {
    render(
      <ToolBar
        format="json"
        setFormat={mockSetFormat}
        error={null}
        onUrlImport={mockOnUrlImport}
        onSave={mockOnSave}
        isCanSave={true}
      />
    );

    const saveButton = screen.getByText('btnSave');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalled();
  });
});
