import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppLogo from '../components/AppLogo';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="hero">
      <AppLogo to="/" size={72} className="hero-logo" />
      <h2>{t('home.title')}</h2>
      <p>{t('home.description')}</p>
      <div className="hero-links">
        <Link to="/population">{t('home.populationDashboard')}</Link>
        <Link to="/employment">{t('home.employmentSearch')}</Link>
      </div>
    </div>
  );
}
