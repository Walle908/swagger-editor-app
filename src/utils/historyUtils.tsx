import { db } from '@/firebase';
import { FirestoreData, HistorySummary, RequestLog, statusToneType } from '@/types/historyTypes';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
export const getStatusTone = (code: number): statusToneType => {
  return code >= 500 ? 'error' : code >= 400 ? 'warning' : 'success';
};

export const formatSize = (formatByte: number): string => {
  return formatByte < 1024
    ? `${formatByte} B`
    : formatByte < 1024 * 1024
      ? `${(formatByte / 1024).toFixed(1)} KB`
      : `${(formatByte / (1024 * 1024)).toFixed(1)} MB`;
};
export const formatDuration = (durationMs: number): string => {
  return durationMs < 1000 ? `${durationMs} ms` : `${(durationMs / 1000).toFixed(2)} s`;
};
export function sortByTimestampDesc(logs: RequestLog[]): RequestLog[] {
  return [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
export const getMethodKey = (method: string): string => {
  return method.toLowerCase();
};
export const buildSummaryElements = (logs: RequestLog[]): HistorySummary => {
  const total = logs.length;
  const logsWithDuration = logs.filter((log) => typeof log.durationMs === 'number');
  const totalDuration = logsWithDuration.reduce((sum, log) => sum + (log.durationMs ?? 0), 0);
  const avg = logsWithDuration.length ? totalDuration / logsWithDuration.length : 0;
  return {
    total,
    avgDurationMs: Math.round(avg),
    successCount: logs.filter((l) => getStatusTone(l.statusCode) === 'success').length,
    errorCount4xx: logs.filter((l) => l.statusCode >= 400 && l.statusCode < 500).length,
    errorCount5xx: logs.filter((l) => l.statusCode >= 500).length,
  };
};

export const getCardsInfo = (summary: HistorySummary) => {
  const successRate = summary.total ? Math.round((summary.successCount / summary.total) * 100) : 0;
  const cards = [
    {
      id: '1',
      label: 'total',
      value: String(summary.total),
      unit: '',
      tone: 'default',
    },
    {
      id: '2',
      label: 'avgDuration',
      value: String(summary.avgDurationMs),
      unit: 'ms',
      tone: 'default',
    },
    {
      id: '3',
      label: 'successRate',
      value: String(successRate),
      unit: '%',
      tone: 'success',
    },
    {
      id: '4',
      label: 'errors',
      value: String(summary.errorCount4xx + summary.errorCount5xx),
      unit: '',
      tone: 'error',
    },
  ];
  return cards;
};

export const getEndpointFromUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}` || url;
  } catch {
    return url;
  }
};
export function mapFirestoreLogToRequestLog(id: string, data: Record<string, unknown>): RequestLog {
  const {
    url = '',
    userId = '',
    durationMs,
    requestSize,
    responseSize,
    errorDetails = null,
  } = data as FirestoreData;

  return {
    id,
    userId,
    url,
    endpoint: getEndpointFromUrl(url),
    method: (typeof data.method === 'string'
      ? data.method.toUpperCase()
      : 'GET') as RequestLog['method'],
    statusCode: Number(data.status ?? data.statusCode ?? 0),
    timestamp: typeof data.timestamp === 'string' ? data.timestamp : new Date().toISOString(),
    durationMs,
    requestSize,
    responseSize,
    errorDetails,
  };
}
export async function getRequestLogsForUser(userId: string): Promise<RequestLog[]> {
  const historyCollection = collection(db, 'requests_history');
  const historyQuery = query(historyCollection, where('userId', '==', userId));
  const snapshot = await getDocs(historyQuery);

  const logs = snapshot.docs.map((docSnapshot) =>
    mapFirestoreLogToRequestLog(docSnapshot.id, docSnapshot.data())
  );

  return sortByTimestampDesc(logs);
}
export async function getRequestLogById(id: string, userId?: string): Promise<RequestLog | null> {
  const docRef = doc(db, 'requests_history', id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }
  const data = snapshot.data();
  if (userId && data.userId && data.userId !== userId) {
    return null;
  }

  return mapFirestoreLogToRequestLog(snapshot.id, data);
}
