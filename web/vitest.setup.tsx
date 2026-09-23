import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { afterEach, vi } from 'vitest';

// Testing Library only auto-cleans when Vitest globals are enabled; do it explicitly.
afterEach(cleanup);

// next/image needs the Next runtime; render a plain <img> in unit tests.
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, sizes, ...rest } = props;
    void fill;
    void priority;
    void sizes;
    return React.createElement('img', rest);
  },
}));
