import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error'
    }
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/setup.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  }
);
