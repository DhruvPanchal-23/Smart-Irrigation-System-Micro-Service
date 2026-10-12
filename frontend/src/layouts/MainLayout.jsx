import { Link, Outlet, useLocation } from 'react-router-dom';
export default function MainLayout() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  return <><header className="public-nav"><Link className="brand" to="/">KisanSetu</Link><nav><Link to="/about">About</Link>{pathname !== '/login' && <Link to="/login">Login</Link>}{pathname !== '/register' && <Link className="button" to="/register">Get started</Link>}</nav></header><main><Outlet /></main>{!isAuthPage && <footer>Weather-based irrigation guidance for responsible farming.</footer>}</>;
}
