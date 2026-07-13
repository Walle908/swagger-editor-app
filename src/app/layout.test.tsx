import { describe, expect, it, vi } from 'vitest';
import RootLayout from './layout';

vi.mock('next/font/google', () => ({
  Libre_Franklin: () => ({ variable: 'mock-libre-franklin' }),
  JetBrains_Mono: () => ({ variable: 'mock-jetbrains-mono' }),
}));

describe('RootLayout Component', () => {
  it('should return valid HTML structure with proper fonts, scripts and children', () => {
    const mockChildren = <div data-testid="page-content">Hello World</div>;

    const result = RootLayout({ children: mockChildren });

    expect(result.type).toBe('html');
    expect(result.props.suppressHydrationWarning).toBe(true);
    expect(result.props.className).toContain('mock-libre-franklin');
    expect(result.props.className).toContain('mock-jetbrains-mono');

    const headElement = result.props.children[0];
    expect(headElement.type).toBe('head');

    const scriptElement = headElement.props.children;
    expect(scriptElement.type).toBe('script');
    expect(scriptElement.props.id).toBe('theme-init');
    expect(scriptElement.props.dangerouslySetInnerHTML.__html).toContain(
      "localStorage.getItem('theme')"
    );

    const bodyElement = result.props.children[1];
    expect(bodyElement.type).toBe('body');
    expect(bodyElement.props.className).toBe('layoutContainer');

    expect(bodyElement.props.children).toBe(mockChildren);
  });
});
