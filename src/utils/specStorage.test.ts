import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveUserSpec, getUserSpec } from './specStorage';

const { docMock, getDocMock, setDocMock } = vi.hoisted(() => ({
  docMock: vi.fn(() => 'specRef'),
  getDocMock: vi.fn(),
  setDocMock: vi.fn(),
}));

vi.mock('@/firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  doc: docMock,
  getDoc: getDocMock,
  setDoc: setDocMock,
}));

describe('saveUserSpec', () => {
  beforeEach(() => vi.clearAllMocks());

  it('writes the spec document with content, format and timestamp', async () => {
    await saveUserSpec('user-1', '{"openapi":"3.0.0"}', 'json');

    expect(docMock).toHaveBeenCalledWith({}, 'specs', 'user-1');
    expect(setDocMock).toHaveBeenCalledWith(
      'specRef',
      expect.objectContaining({
        content: '{"openapi":"3.0.0"}',
        format: 'json',
        updatedAt: expect.any(String),
      })
    );
  });
});

describe('getUserSpec', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the saved spec data when present', async () => {
    getDocMock.mockResolvedValue({
      data: () => ({ content: 'saved', format: 'yaml', updatedAt: '2026-01-01' }),
    });

    expect(await getUserSpec('user-1')).toEqual({
      content: 'saved',
      format: 'yaml',
      updatedAt: '2026-01-01',
    });
    expect(docMock).toHaveBeenCalledWith({}, 'specs', 'user-1');
  });

  it('returns null when no spec document exists', async () => {
    getDocMock.mockResolvedValue({ data: () => undefined });
    expect(await getUserSpec('user-1')).toBeNull();
  });
});
