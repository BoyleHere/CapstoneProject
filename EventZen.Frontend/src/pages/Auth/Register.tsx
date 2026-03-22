import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Eye, EyeOff } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authApi.register({ name, email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>Register for EventZen</h3>
      
      {error && <div style={{ color: 'white', backgroundColor: 'var(--cf-red)', padding: '8px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
      
      <form onSubmit={handleRegister}>
        <div className="cf-form-group">
          <label className="cf-label">Full Name</label>
          <input 
            type="text" 
            className="cf-input" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
      <div style={{ marginTop: '15px', fontSize: '13px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
}
