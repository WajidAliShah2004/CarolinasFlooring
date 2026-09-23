import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

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
