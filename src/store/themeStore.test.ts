import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from './themeStore';

describe('useThemeStore', () => {
  const get = () => useThemeStore.getState();

  beforeEach(() => useThemeStore.setState({ theme: 'light' }));

  it('defaults to the light theme', () => {
    expect(get().theme).toBe('light');
  });

  it('sets the theme explicitly', () => {
    get().setTheme('dark');
    expect(get().theme).toBe('dark');
  });

  it('toggles between light and dark', () => {
    get().toggleTheme();
    expect(get().theme).toBe('dark');

    get().toggleTheme();
    expect(get().theme).toBe('light');
  });
});
