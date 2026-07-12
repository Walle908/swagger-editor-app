import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { EndpointCard } from './EndpointCard';

import { HttpMethodType } from '@/types/openapi';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/firebase', () => ({
  auth: {
    currentUser: { uid: 'mock-user-123' },
  },
  db: {},
}));

vi.mock('./endpointInfo/EndpoinInfo', () => ({
  EndpointInfo: ({ onExecute }: { onExecute: () => void; onGenerateClear?: () => void }) => (
    <div data-testid="mock-endpoint-info">
      <button onClick={onExecute}>Execute Request</button>
    </div>
  ),
}));

vi.mock('./execution-result/ExecutionResult', () => ({
  ExecutionResult: () => <div data-testid="mock-execution-result">Execution Result Display</div>,
}));

describe('EndpointCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render minimized header content successfully and expand details section upon click', () => {
    render(
      <EndpointCard
        method="POST"
        path="/posts"
        summary="Create a new article asset"
        description="Detailed specification guidelines for posts creation route"
        type={'POST' as HttpMethodType}
        baseUrl="https://example.com"
        responses={[]}
      />
    );

    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('/posts')).toBeInTheDocument();
    expect(screen.getByText('Create a new article asset')).toBeInTheDocument();

    expect(screen.queryByTestId('mock-endpoint-info')).toBeNull();

    const clickableCardHeader = screen.getByText('POST');
    fireEvent.click(clickableCardHeader);

    expect(screen.getByTestId('mock-endpoint-info')).toBeInTheDocument();
    expect(screen.getByTestId('mock-execution-result')).toBeInTheDocument();
  });
});
