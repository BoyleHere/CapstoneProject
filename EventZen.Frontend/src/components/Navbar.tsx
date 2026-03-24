import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

export function Navbar() {
  const { isAuthenticated, role, name, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('mock_jwt');
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return location.pathname === path;
  };

  const linkStyle = (path: string) => ({
    color: isActive(path) ? 'var(--cf-blue)' : 'var(--text-secondary)',
    fontWeight: isActive(path) ? '600' : '500',
    borderBottom: isActive(path) ? '2px solid var(--cf-blue)' : '2px solid transparent',
    paddingBottom: '2px',
    transition: 'all 0.2s',
    textDecoration: 'none'
  });

  return (
    <div style={{ backgroundColor: 'var(--header-bg)', borderBottom: '1px solid var(--border-color)', padding: '14px 24px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left Side Navigation */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: '700', fontSize: '20px', color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
            EventZen
          </Link>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: '500', padding: '4px 0 0 0' }}>
            <Link to="/" style={linkStyle('/')}>Home</Link>
            <Link to="/events" style={linkStyle('/events')}>Events</Link>
            {isAuthenticated && role === 'CUSTOMER' && (
              <Link to="/my-bookings" style={linkStyle('/my-bookings')}>My Bookings</Link>
            )}
            {isAuthenticated && role === 'ADMIN' && (
              <>
                <Link to="/admin" style={linkStyle('/admin')}>Dashboard</Link>
                <Link to="/admin/events" style={linkStyle('/admin/events')}>Manage Events</Link>
                <Link to="/admin/venues" style={linkStyle('/admin/venues')}>Manage Venues</Link>
                <Link to="/admin/vendors" style={linkStyle('/admin/vendors')}>Manage Vendors</Link>
              </>
            )}
          </div>
        </div>

        {/* Right Side Auth */}
        <div style={{ fontSize: '14px', fontWeight: '500' }}>
          {!isAuthenticated ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link to="/login">Login</Link>
              <Link to="/register" style={{ backgroundColor: 'var(--cf-blue)', color: 'white', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgb(0 0 0 / 0.05)' }}>Register</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Hi, <Link to="/profile" style={{color: role === 'ADMIN' ? 'var(--cf-red)' : 'var(--cf-blue)', fontWeight: '600', textDecoration: 'none'}}>{name}</Link>
                <span style={{color: 'var(--text-secondary)', fontSize: '12px', padding: '2px 8px', backgroundColor: '#f3f4f6', borderRadius: '9999px', fontWeight: '600'}}>{role === 'ADMIN' ? 'Admin' : 'Customer'}</span>
              </span>
              <a href="#" onClick={handleLogout} style={{ cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Logout</a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
