import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom não implementa scrollTo
window.scrollTo = vi.fn();

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.location.hash = '';
});
