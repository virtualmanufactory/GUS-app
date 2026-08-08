import { Link } from 'react-router-dom';
import AppLogo from '../components/AppLogo';

export default function HomePage() {
  return (
    <div className="hero">
      <AppLogo to="/" size={72} className="hero-logo" />
      <h2>GusCompanyFinder</h2>
      <p>
        Przeglądaj dane statystyczne GUS o gospodarce, społeczeństwie i środowisku
        dla gmin, powiatów, województw i całej Polski.
      </p>
      <div className="hero-links">
        <Link to="/population">Dashboard populacji</Link>
        <Link to="/subjects">Przeglądaj tematy</Link>
        <Link to="/variables">Szukaj zmiennych</Link>
        <Link to="/units">Jednostki terytorialne</Link>
      </div>
    </div>
  );
}
