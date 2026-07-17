import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: 1120,
        margin: '0 auto',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/dashboard" style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          textDecoration: 'none'
        }}>
          Spendly
        </Link>

        <div className="navbar-links">
          <div style={{ display: 'flex', gap: 24 }}>
            <NavLink to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />
            <NavLink to="/transactions" label="Transactions" active={isActive('/transactions')} />
            <NavLink to="/categories" label="Categories" active={isActive('/categories')} />
          </div>
        </div>

        <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--ink)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="span-name" style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{user?.name}</span>
          <button onClick={handleLogout} className="text-action span-name" style={{ marginLeft: 4 }}>
            Log out
          </button>
        </div>

        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
        </button>
      </div>

      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link to="/dashboard" onClick={closeMobile}>Dashboard</Link>
        <Link to="/transactions" onClick={closeMobile}>Transactions</Link>
        <Link to="/categories" onClick={closeMobile}>Categories</Link>
        <button onClick={() => { handleLogout(); closeMobile(); }}>Log out</button>
      </div>
    </nav>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      style={{
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        color: active ? 'var(--ink)' : 'var(--ink-muted)',
        textDecoration: 'none',
        borderBottom: active ? '2px solid var(--ink)' : '2px solid transparent',
        paddingBottom: 2,
        transition: 'color 0.15s ease'
      }}
    >
      {label}
    </Link>
  );
}
