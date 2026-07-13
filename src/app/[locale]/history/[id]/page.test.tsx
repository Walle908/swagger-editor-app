import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistoryDetail from './page';

vi.mock('@/views/historyPage/HistoryDetailPage/HistoryDetailPage', () => ({
  default: ({ id }: { id: string }) => <div data-testid="history-detail-view">{id}</div>,
}));

describe('History detail route', () => {
  it('resolves the id param and renders the HistoryDetailPage view with it', async () => {
    const jsx = await HistoryDetail({ params: Promise.resolve({ id: 'log-42' }) });
    render(jsx);
    expect(screen.getByTestId('history-detail-view')).toHaveTextContent('log-42');
  });
});
