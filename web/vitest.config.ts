import { defineConfig } from 'vitest/config';

// JSX is compiled by Vite's built-in transform (tsconfig "jsx": "react-jsx"); no React plugin needed.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.tsx'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
  },
});
