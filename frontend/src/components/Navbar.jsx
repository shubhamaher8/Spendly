import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <NavLink to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />
            <NavLink to="/transactions" label="Transactions" active={isActive('/transactions')} />
            <NavLink to="/categories" label="Categories" active={isActive('/categories')} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{user?.name}</span>
            <button onClick={handleLogout} className="text-action" style={{ marginLeft: 4 }}>
              Log out
            </button>
          </div>
        </div>
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
