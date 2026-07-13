import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    server: {
      deps: {
        inline: ['next-intl', 'next'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'node_modules/',
        '.next/',
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/**/*.d.ts',
        'src/constants/**',
        'src/types/**',
        'src/test-utils/**',
        'src/**/index.ts',
        'src/i18n/**',
        'src/proxy.ts',
        'src/firebase.ts',
        'src/app/not-found.tsx',
        'src/app/layout.tsx',
        'src/app/[locale]/[...rest]/page.tsx',
        'src/app/[locale]/not-found.tsx',
        'src/app/[locale]/loading.tsx',
        'src/app/[locale]/error.tsx',
        'src/app/[locale]/signin/page.tsx',
        'src/app/[locale]/signup/page.tsx',
      ],
      thresholds: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      public: path.resolve(__dirname, './public'),
    },
  },
});
