import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';

import MainPage from './MainPage';
import { useSchemaStore } from '@/components/restful/store/useSchemaStore';
import { onIdTokenChanged } from 'firebase/auth';
import { getUserSpec, saveUserSpec } from '@/utils/specStorage';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/firebase', () => ({
  auth: { currentUser: { uid: 'mock-user-123' } },
}));

vi.mock('firebase/auth', () => ({
  onIdTokenChanged: vi.fn(),
}));

vi.mock('@/components/restful/store/useSchemaStore', () => ({
  useSchemaStore: vi.fn(),
}));

vi.mock('@/utils/specStorage', () => ({
  getUserSpec: vi.fn(),
  saveUserSpec: vi.fn(),
}));

vi.mock('@/components/restful', () => ({
  ToolBar: ({ onSave }: { onSave: () => void }) => (
    <div data-testid="mock-toolbar">
      <button data-testid="save-btn" onClick={onSave}>
        Save Spec
      </button>
    </div>
  ),
  CodeEditor: () => <div data-testid="mock-editor">CodeEditor Component</div>,
  SwaggerViewer: () => <div data-testid="mock-viewer">SwaggerViewer Component</div>,
}));

describe('MainPage Component', () => {
  const mockSetCodeAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useSchemaStore as unknown as Mock).mockImplementation((selector) =>
      selector({
        parsedSchema: { info: { title: 'Test API', version: '1.0.0' }, openapi: '3.0.0' },
        error: null,
        code: 'openapi: 3.0.0',
        format: 'yaml',
        setCodeAction: mockSetCodeAction,
        toggleFormatAction: vi.fn(),
      })
    );
  });

  test('should render layout successfully for a guest user', () => {
    (onIdTokenChanged as Mock).mockImplementation((_auth, callback) => {
      callback(null);
      return vi.fn();
    });

    render(<MainPage />);

    expect(screen.getByTestId('mock-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-editor')).toBeInTheDocument();
    expect(screen.getByTestId('mock-viewer')).toBeInTheDocument();
  });

  test('should restore user draft from firestore on initial auth load change', async () => {
    const mockUser = { uid: 'auth-user-999' };
    (onIdTokenChanged as Mock).mockImplementation((_auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    (getUserSpec as Mock).mockResolvedValue({
      content: 'openapi: 3.0.0\nsaved: true',
      format: 'yaml',
    });

    render(<MainPage />);

    await waitFor(() => {
      expect(getUserSpec).toHaveBeenCalledWith('auth-user-999');
      expect(mockSetCodeAction).toHaveBeenCalledWith('openapi: 3.0.0\nsaved: true', '');
    });
  });

  test('should safely execute handleSaveSpec callback upon toolbar save action triggers', async () => {
    const mockUser = { uid: 'auth-user-999' };
    (onIdTokenChanged as Mock).mockImplementation((_auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    (getUserSpec as Mock).mockResolvedValue(null);
    (saveUserSpec as Mock).mockResolvedValue(undefined);

    render(<MainPage />);

    const saveButton = screen.getByTestId('save-btn');
    saveButton.click();

    await waitFor(() => {
      expect(saveUserSpec).toHaveBeenCalledWith('auth-user-999', 'openapi: 3.0.0', 'yaml');
    });
  });
});
