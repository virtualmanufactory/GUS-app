import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import pl from './locales/pl.json';

const STORAGE_KEY = 'gus-language';

export const supportedLanguages = ['pl', 'en'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

function getInitialLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'pl' || stored === 'en') return stored;
  return navigator.language.startsWith('pl') ? 'pl' : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    pl: { translation: pl },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'pl',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export default i18n;
