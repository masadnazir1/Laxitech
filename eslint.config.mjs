import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  globalIgnores([
    '.next/**',
    'node_modules/**',
    '.agents/**',
    '.aistudio/**',
    '.opencode/**',
    '.taste-skill/**',
    'public/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
