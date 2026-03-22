import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { Eye, EyeOff } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const resp = await authApi.login({ email, password });
      
      localStorage.setItem('mock_jwt', resp.token); // Store the genuine JWT in the same key for apiClient
      
      // Decode JWT to get the user ID using standard base64 decoding of the payload
      const payloadBase64 = resp.token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      
      const userId = parseInt(decodedPayload.sub || decodedPayload.nameid || '0');
      
      // Note: Role is usually returned as ROLE_CUSTOMER or CUSTOMER depending on backend.
      // We'll normalize it to 'CUSTOMER' or 'ADMIN' for our AuthContext
      const normalizedRole = resp.role.replace('ROLE_', '') as 'CUSTOMER' | 'ADMIN';
      
      login(userId, resp.name, normalizedRole);
      
      if (normalizedRole === 'ADMIN') navigate('/admin');
      else navigate('/events');
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>Enter EventZen</h3>
      
      {error && <div style={{ color: 'white', backgroundColor: 'var(--cf-red)', padding: '8px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="cf-form-group">
          <label className="cf-label">Email Address</label>
          <input 
            type="email" 
            className="cf-input" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="cf-form-group">
          <label className="cf-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              className="cf-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ paddingRight: '36px' }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
            >
              {showPassword ? <EyeOff size={16} color="#888" /> : <Eye size={16} color="#888" />}
            </button>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="cf-btn cf-btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </div>
      </form>
      <div style={{ marginTop: '15px', fontSize: '13px', textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
}
