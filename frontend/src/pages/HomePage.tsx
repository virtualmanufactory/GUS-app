import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="hero">
      <h2>Bank Danych Lokalnych GUS</h2>
      <p>
        Przeglądaj dane statystyczne o gospodarce, społeczeństwie i środowisku
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
