import { Link } from 'react-router-dom';

interface AppLogoProps {
  to?: string;
  size?: number;
  showName?: boolean;
  className?: string;
}

export default function AppLogo({
  to = '/',
  size = 36,
  showName = true,
  className = '',
}: AppLogoProps) {
  const content = (
    <>
      <img
        src="/logo.png"
        alt="GusCompanyFinder"
        width={size}
        height={size}
        className="app-logo-img"
      />
      {showName && <span className="app-logo-name">GusCompanyFinder</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`app-logo ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`app-logo ${className}`}>{content}</div>;
}
