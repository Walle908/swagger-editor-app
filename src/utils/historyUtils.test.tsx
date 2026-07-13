import { describe, it, expect, vi } from 'vitest';
import {
  getStatusTone,
  formatSize,
  formatDuration,
  sortByTimestampDesc,
  getMethodKey,
  buildSummaryElements,
  getCardsInfo,
  getEndpointFromUrl,
  mapFirestoreLogToRequestLog,
  getRequestLogsForUser,
  getRequestLogById,
} from './historyUtils';
import { RequestLog } from '@/types/historyTypes';

const collectionMock = vi.fn();
const docMock = vi.fn();
const getDocMock = vi.fn();
const getDocsMock = vi.fn();
const queryMock = vi.fn();
const whereMock = vi.fn();

vi.mock('@/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => collectionMock(...args),
  doc: (...args: unknown[]) => docMock(...args),
  getDoc: (...args: unknown[]) => getDocMock(...args),
  getDocs: (...args: unknown[]) => getDocsMock(...args),
  query: (...args: unknown[]) => queryMock(...args),
  where: (...args: unknown[]) => whereMock(...args),
}));

describe('getStatusTone', () => {
  it('returns error for 5xx codes', () => {
    expect(getStatusTone(500)).toBe('error');
    expect(getStatusTone(503)).toBe('error');
  });

  it('returns warning for 4xx codes', () => {
    expect(getStatusTone(404)).toBe('warning');
  });

  it('returns success for other codes', () => {
    expect(getStatusTone(200)).toBe('success');
    expect(getStatusTone(301)).toBe('success');
  });
});

describe('formatSize', () => {
  it('formats bytes below 1024 as B', () => {
    expect(formatSize(512)).toBe('512 B');
  });

  it('formats sizes below 1MB as KB', () => {
    expect(formatSize(2048)).toBe('2.0 KB');
  });

  it('formats sizes at or above 1MB as MB', () => {
    expect(formatSize(1024 * 1024 * 2)).toBe('2.0 MB');
  });
});

describe('formatDuration', () => {
  it('formats sub-second durations in ms', () => {
    expect(formatDuration(500)).toBe('500 ms');
  });

  it('formats durations of a second or more in seconds', () => {
    expect(formatDuration(1500)).toBe('1.50 s');
  });
});

describe('sortByTimestampDesc', () => {
  it('sorts logs by timestamp, most recent first, without mutating the input', () => {
    const logs = [
      { id: '1', timestamp: '2026-01-01T00:00:00.000Z' },
      { id: '2', timestamp: '2026-01-03T00:00:00.000Z' },
      { id: '3', timestamp: '2026-01-02T00:00:00.000Z' },
    ] as RequestLog[];

    const sorted = sortByTimestampDesc(logs);

    expect(sorted.map((log) => log.id)).toEqual(['2', '3', '1']);
    expect(logs.map((log) => log.id)).toEqual(['1', '2', '3']);
  });
});

describe('getMethodKey', () => {
  it('lowercases the http method', () => {
    expect(getMethodKey('GET')).toBe('get');
    expect(getMethodKey('POST')).toBe('post');
  });
});

describe('buildSummaryElements', () => {
  it('aggregates totals, average duration and status counts', () => {
    const logs = [
      { statusCode: 200, durationMs: 100 },
      { statusCode: 404, durationMs: 200 },
      { statusCode: 500, durationMs: 300 },
    ] as RequestLog[];

    const summary = buildSummaryElements(logs);

    expect(summary.total).toBe(3);
    expect(summary.avgDurationMs).toBe(200);
    expect(summary.successCount).toBe(1);
    expect(summary.errorCount4xx).toBe(1);
    expect(summary.errorCount5xx).toBe(1);
  });

  it('returns zeroed averages for an empty log list', () => {
    const summary = buildSummaryElements([]);

    expect(summary.total).toBe(0);
    expect(summary.avgDurationMs).toBe(0);
  });

  it('ignores logs without a numeric duration when averaging', () => {
    const logs = [{ statusCode: 200 }, { statusCode: 200, durationMs: 100 }] as RequestLog[];

    const summary = buildSummaryElements(logs);

    expect(summary.avgDurationMs).toBe(100);
  });
});

describe('getCardsInfo', () => {
  it('computes success rate and error total from the summary', () => {
    const cards = getCardsInfo({
      total: 4,
      avgDurationMs: 150,
      successCount: 2,
      errorCount4xx: 1,
      errorCount5xx: 1,
    });

    const byId = Object.fromEntries(cards.map((card) => [card.id, card]));
    expect(byId['1']?.value).toBe('4');
    expect(byId['2']?.value).toBe('150');
    expect(byId['3']?.value).toBe('50');
    expect(byId['4']?.value).toBe('2');
  });

  it('avoids division by zero when total is 0', () => {
    const cards = getCardsInfo({
      total: 0,
      avgDurationMs: 0,
      successCount: 0,
      errorCount4xx: 0,
      errorCount5xx: 0,
    });

    const successRate = cards.find((card) => card.label === 'successRate');
    expect(successRate?.value).toBe('0');
  });
});

describe('getEndpointFromUrl', () => {
  it('extracts pathname and search from a full url', () => {
    expect(getEndpointFromUrl('https://api.example.com/pets?limit=10')).toBe('/pets?limit=10');
  });

  it('returns the original value when the url cannot be parsed', () => {
    expect(getEndpointFromUrl('not-a-url')).toBe('not-a-url');
  });
});

describe('mapFirestoreLogToRequestLog', () => {
  it('maps firestore data into a normalized RequestLog', () => {
    const log = mapFirestoreLogToRequestLog('log-1', {
      url: 'https://api.example.com/pets',
      userId: 'user-1',
      method: 'post',
      status: 201,
      durationMs: 120,
      requestSize: 50,
      responseSize: 100,
      timestamp: '2026-01-01T00:00:00.000Z',
      errorDetails: null,
    });

    expect(log).toEqual({
      id: 'log-1',
      userId: 'user-1',
      url: 'https://api.example.com/pets',
      endpoint: '/pets',
      method: 'POST',
      statusCode: 201,
      timestamp: '2026-01-01T00:00:00.000Z',
      durationMs: 120,
      requestSize: 50,
      responseSize: 100,
      errorDetails: null,
    });
  });

  it('falls back to defaults for missing fields', () => {
    const log = mapFirestoreLogToRequestLog('log-2', {});

    expect(log.method).toBe('GET');
    expect(log.statusCode).toBe(0);
    expect(log.url).toBe('');
    expect(typeof log.timestamp).toBe('string');
  });

  it('reads statusCode when status is not present', () => {
    const log = mapFirestoreLogToRequestLog('log-3', { statusCode: 404 });

    expect(log.statusCode).toBe(404);
  });
});

describe('getRequestLogsForUser', () => {
  it('queries firestore for the user and returns sorted logs', async () => {
    collectionMock.mockReturnValue('collectionRef');
    whereMock.mockReturnValue('whereClause');
    queryMock.mockReturnValue('queryRef');
    getDocsMock.mockResolvedValue({
      docs: [
        {
          id: 'log-1',
          data: () => ({
            url: 'https://api.example.com/a',
            userId: 'user-1',
            method: 'GET',
            status: 200,
            timestamp: '2026-01-01T00:00:00.000Z',
          }),
        },
        {
          id: 'log-2',
          data: () => ({
            url: 'https://api.example.com/b',
            userId: 'user-1',
            method: 'GET',
            status: 200,
            timestamp: '2026-01-03T00:00:00.000Z',
          }),
        },
      ],
    });

    const logs = await getRequestLogsForUser('user-1');

    expect(whereMock).toHaveBeenCalledWith('userId', '==', 'user-1');
    expect(logs.map((log) => log.id)).toEqual(['log-2', 'log-1']);
  });
});

describe('getRequestLogById', () => {
  it('returns null when the document does not exist', async () => {
    getDocMock.mockResolvedValue({ exists: () => false });

    const result = await getRequestLogById('log-1');

    expect(result).toBeNull();
  });

  it('returns the mapped log when it exists and belongs to the user', async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      id: 'log-1',
      data: () => ({
        url: 'https://api.example.com/a',
        userId: 'user-1',
        method: 'GET',
        status: 200,
        timestamp: '2026-01-01T00:00:00.000Z',
      }),
    });

    const result = await getRequestLogById('log-1', 'user-1');

    expect(result?.id).toBe('log-1');
    expect(result?.userId).toBe('user-1');
  });

  it('returns null when the log belongs to a different user', async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      id: 'log-1',
      data: () => ({
        url: 'https://api.example.com/a',
        userId: 'other-user',
        method: 'GET',
        status: 200,
        timestamp: '2026-01-01T00:00:00.000Z',
      }),
    });

    const result = await getRequestLogById('log-1', 'user-1');

    expect(result).toBeNull();
  });
});
