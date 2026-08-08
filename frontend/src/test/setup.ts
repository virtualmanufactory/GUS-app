import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import i18n from '../i18n';

i18n.changeLanguage('pl');

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
