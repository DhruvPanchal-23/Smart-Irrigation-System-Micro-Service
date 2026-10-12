import { useEffect, useState } from 'react';
import { FiBell, FiChevronDown, FiCloud, FiClock, FiDroplet, FiGrid, FiLogOut, FiMap, FiMenu, FiPlusSquare, FiUser, FiX } from 'react-icons/fi';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const links = [
  ['/dashboard', 'Overview', FiGrid], ['/farms', 'My farms', FiMap], ['/farms/add', 'Add farm', FiPlusSquare],
  ['/weather', 'Weather', FiCloud], ['/recommendation', 'Recommendation', FiDroplet],
  ['/history', 'History', FiClock], ['/profile', 'Profile', FiUser],
];
const pageNames = { '/dashboard': 'Dashboard', '/farms': 'My farms', '/farms/add': 'Add farm', '/weather': 'Weather', '/recommendation': 'Recommendation', '/history': 'History', '/profile': 'Profile' };

export default function DashboardLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = auth.user?.name?.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'F';
  const logout = async () => { await auth.logout(); navigate('/login', { replace: true }); };

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setMenuOpen(false);
    document.body.classList.add('navigation-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('navigation-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  return <div className="shell">
    <aside className={menuOpen ? 'open' : ''} aria-label="Dashboard navigation" aria-hidden={!menuOpen ? undefined : false}>
      <div className="sidebar-brand"><span className="brand-mark"><FiDroplet /></span><div><strong>KisanSetu</strong><small>Water Smart, Farm Smart</small></div><button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><FiX /></button></div>
      <nav><span className="nav-label">Workspace</span>{links.map(([to, label, Icon]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}><Icon /><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-promo"><FiDroplet /><strong>Save Water<br />Grow Better</strong><small>Every drop counts!</small></div>
      <div className="sidebar-user"><span className="avatar small">{initials}</span><div><strong>{auth.user?.name || 'Farmer'}</strong><small>{auth.user?.email || 'Your account'}</small></div></div>
      <button className="logout" onClick={logout}><FiLogOut /> Log out</button>
    </aside>
    {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <section className="workspace">
      <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><FiMenu /></button><div><span>Workspace</span><strong>{pageNames[location.pathname] || 'Farm details'}</strong></div><div className="topbar-actions"><button className="notification-button" aria-label="Notifications"><FiBell /><span>3</span></button><div className="topbar-user"><span className="avatar">{initials}</span><span><strong>{auth.user?.name || 'Farmer'}</strong><small>Farmer account</small></span><FiChevronDown /></div></div></header>
      <main className="page"><Outlet /></main>
    </section>
  </div>;
}
