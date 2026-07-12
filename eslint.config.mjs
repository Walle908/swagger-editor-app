import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'coverage/**',
    'dist/**',
    'next-env.d.ts',
  ]),

  ...nextVitals,
  ...nextTs,

  {
    files: ['**/*.{ts,tsx,mts,js,jsx,mjs}'],
    extends: [js.configs.recommended, ...tseslint.configs.strict, eslintConfigPrettier],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
    linterOptions: {
      noInlineConfig: true,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },

  {
    files: ['**/*.test.tsx', '**/*.spec.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]);

export default eslintConfig;
