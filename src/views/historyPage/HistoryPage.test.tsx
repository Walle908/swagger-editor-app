import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getRequestLogsForUser, buildSummaryElements } from '@/utils/historyUtils';
import { Text } from '@/components/ui';
import { RequestLog } from '@/types/historyTypes';
import HistoryPage from './HistoryPage';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `translated_${key}`),
}));

vi.mock('@/utils/historyUtils', () => ({
  getRequestLogsForUser: vi.fn(),
  buildSummaryElements: vi.fn().mockReturnValue({ total: 10, success: 8 }),
}));

vi.mock('@/components/ui', () => ({
  Text: ({ children, color, size, as }: React.ComponentPropsWithoutRef<typeof Text>) => (
    <span data-testid="mock-text" data-color={color} data-size={size} data-as={as}>
      {children}
    </span>
  ),
}));

vi.mock('@/components/history/HistoryTable/EmptyHistory/EmptyHistory', () => ({
  default: () => <div data-testid="mock-empty-history" />,
}));

vi.mock('@/components/history/HistoryTable/HistoryTable', () => ({
  default: () => <div data-testid="mock-history-table" />,
}));

vi.mock('@/components/history/HistoryCards/HistoryCards', () => ({
  default: () => <div data-testid="mock-history-cards" />,
}));

interface MockElement {
  type: unknown;
  props: {
    children?: MockElement | MockElement[];
    'data-testid'?: string;
    color?: string;
  };
}

describe('HistoryPage Server Component', () => {
  const mockUid = 'user_123_abc';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty state when user has no logs', async () => {
    vi.mocked(getRequestLogsForUser).mockResolvedValue([]);

    const result = (await HistoryPage({ uid: mockUid })) as unknown as MockElement;

    expect(getRequestLogsForUser).toHaveBeenCalledWith(mockUid);
    expect(buildSummaryElements).toHaveBeenCalledWith([]);

    const ArrayOfChildren = result.props.children as MockElement[];
    const contentContainer = ArrayOfChildren[1];
    const targetChild = contentContainer?.props.children as MockElement;

    expect(targetChild.type).not.toBeNull();
  });

  it('should render analytics cards and history table when logs exist', async () => {
    const mockLogs: RequestLog[] = [
      {
        id: 'log_001',
        userId: mockUid,
        method: 'GET',
        endpoint: '/api/v1/users',
        url: 'https://example.com',
        statusCode: 200,
        timestamp: '2026-07-13T21:23:00Z',
        errorDetails: null,
      },
    ];
    vi.mocked(getRequestLogsForUser).mockResolvedValue(mockLogs);

    const result = (await HistoryPage({ uid: mockUid })) as unknown as MockElement;

    const ArrayOfChildren = result.props.children as MockElement[];
    const contentContainer = ArrayOfChildren[1];

    const FragmentWrapper = contentContainer?.props.children as MockElement;
    const [cards, table] = FragmentWrapper.props.children as MockElement[];

    expect(cards).toBeDefined();
    expect(table).toBeDefined();
  });

  it('should render error message if getRequestLogsForUser fails', async () => {
    vi.mocked(getRequestLogsForUser).mockRejectedValue(new Error('DB connection failed'));

    const result = (await HistoryPage({ uid: mockUid })) as unknown as MockElement;

    const ArrayOfChildren = result.props.children as MockElement[];
    const contentContainer = ArrayOfChildren[1];
    const errorTextElement = contentContainer?.props.children as MockElement;

    expect(errorTextElement.props.color).toBe('error');
    expect(errorTextElement.props.children).toBe('translated_loadError');
  });
});
