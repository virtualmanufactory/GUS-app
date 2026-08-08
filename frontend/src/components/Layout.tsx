import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppLogo from './AppLogo';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="app">
      <header className="header">
        <AppLogo />
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            {t('nav.home')}
          </Link>
          <Link to="/population" className={isActive('/population') ? 'active' : ''}>
            {t('nav.population')}
          </Link>
          <Link to="/subjects" className={isActive('/subjects') ? 'active' : ''}>
            {t('nav.subjects')}
          </Link>
          <Link to="/variables" className={isActive('/variables') ? 'active' : ''}>
            {t('nav.variables')}
          </Link>
          <Link to="/units" className={isActive('/units') ? 'active' : ''}>
            {t('nav.units')}
          </Link>
        </nav>
        <LanguageSwitcher />
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        {t('common.appName')} &middot; {t('common.dataSource')} &middot;{' '}
        <a href="https://api.stat.gov.pl/Home/BdlApi" target="_blank" rel="noreferrer">
          {t('common.apiBdl')}
        </a>
      </footer>
    </div>
  );
}
