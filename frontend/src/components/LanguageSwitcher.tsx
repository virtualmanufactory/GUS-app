import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '../i18n';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: SupportedLanguage) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="language-switcher">
      <label htmlFor="language-select">{t('language.label')}</label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
        aria-label={t('language.label')}
      >
        <option value="pl">{t('language.pl')}</option>
        <option value="en">{t('language.en')}</option>
      </select>
    </div>
  );
}
