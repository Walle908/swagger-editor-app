import { describe, expect, it, vi } from 'vitest';
import NotFound from './not-found';
vi.mock('next/error', () => ({
  default: ({ statusCode }: { statusCode: number }) => (
    <div data-testid="mock-next-error" data-status={statusCode}>
      Error {statusCode}
    </div>
  ),
}));

describe('NotFound Component (Root)', () => {
  it('should return valid HTML structure with next/error component set to 404', () => {
    const result = NotFound();

    expect(result.type).toBe('html');
    expect(result.props.lang).toBe('en');

    const bodyElement = result.props.children;
    expect(bodyElement.type).toBe('body');

    const errorComponent = bodyElement.props.children;
    expect(errorComponent.props.statusCode).toBe(404);
  });
});
