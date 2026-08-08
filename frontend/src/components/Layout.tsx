import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="app">
      <header className="header">
        <h1>GUS BDL</h1>
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Start
          </Link>
          <Link to="/population" className={isActive('/population') ? 'active' : ''}>
            Populacja
          </Link>
          <Link to="/subjects" className={isActive('/subjects') ? 'active' : ''}>
            Tematy
          </Link>
          <Link to="/variables" className={isActive('/variables') ? 'active' : ''}>
            Zmienne
          </Link>
          <Link to="/units" className={isActive('/units') ? 'active' : ''}>
            Jednostki
          </Link>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        Dane: Bank Danych Lokalnych GUS &middot;{' '}
        <a href="https://api.stat.gov.pl/Home/BdlApi" target="_blank" rel="noreferrer">
          API BDL
        </a>
      </footer>
    </div>
  );
}
