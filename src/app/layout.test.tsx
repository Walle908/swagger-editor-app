import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

describe('RootLayout (Server Component)', () => {
  it('should transparently render and return its children without any extra wrappers', async () => {
    const mockChildren = <div data-testid="test-child">Layout Content</div>;

    const result = await RootLayout({ children: mockChildren });

    render(result);

    const childElement = screen.getByTestId('test-child');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Layout Content');
  });
});
