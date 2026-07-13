import { describe, expect, it, vi, beforeEach } from 'vitest';
import { notFound } from 'next/navigation';
import CatchAllPage from './page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('CatchAllPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should immediately trigger the notFound boundary when called', () => {
    CatchAllPage();

    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
