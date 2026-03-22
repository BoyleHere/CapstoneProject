import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

export function Navbar() {
  const { isAuthenticated, role, name, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('mock_jwt');
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: 'var(--header-bg)', borderBottom: '1px solid var(--border-color)', padding: '10px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left Side Navigation */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--text-primary)', textDecoration: 'none' }}>
            EventZen
          </Link>
          <div style={{ display: 'flex', gap: '15px', fontSize: '13px' }}>
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            {isAuthenticated && role === 'CUSTOMER' && (
              <Link to="/my-bookings">My Bookings</Link>
            )}
            {isAuthenticated && role === 'ADMIN' && (
              <>
                <Link to="/admin">Dashboard (Approvals)</Link>
                <Link to="/admin/events">Manage Events</Link>
                <Link to="/admin/venues">Manage Venues</Link>
                <Link to="/admin/vendors">Manage Vendors</Link>
              </>
            )}
          </div>
        </div>

        {/* Right Side Auth */}
        <div style={{ fontSize: '13px' }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span>
                Hi, <Link to="/profile" style={{color: role === 'ADMIN' ? 'var(--cf-red)' : 'var(--cf-blue)', fontWeight: 'bold', textDecoration: 'none'}}>{name}</Link>! 
                <span style={{color: '#888', marginLeft: '4px'}}>({role === 'ADMIN' ? 'Admin' : 'Customer'})</span>
              </span>
              <a href="#" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
