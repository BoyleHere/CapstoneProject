import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import type { UserProfileResponse } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';

export function Profile() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userApi.getProfile();
      setProfile(data);
      setName(data.name);
    } catch (err: any) {
      setError('Failed to load profile.');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');
    
    try {
      const updatedProfile = await userApi.updateProfile({
        name: name !== profile?.name ? name : undefined,
        password: password ? password : undefined
      });
      setProfile(updatedProfile);
      setSuccessMsg('Profile updated successfully! Note: You will need to log out and log back in to see the updated name in the top navigation bar.');
      setEditMode(false);
      setPassword(''); // clear password field
    } catch (err: any) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="content-area">Loading profile...</div>;

  return (
    <div className="content-area">
      <div className="panel" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '20px' }}>
        <div className="panel-header" style={{ fontWeight: 'bold' }}>User Profile</div>
        <div className="panel-body">
          {error && <div style={{ color: 'white', backgroundColor: 'var(--cf-red)', padding: '8px', marginBottom: '15px', fontSize: '12px' }}>{error}</div>}
          {successMsg && <div style={{ color: 'white', backgroundColor: '#28a745', padding: '8px', marginBottom: '15px', fontSize: '12px' }}>{successMsg}</div>}
          
          {!editMode ? (
            <div style={{ fontSize: '14px', lineHeight: '2' }}>
              <p><strong>Name:</strong> {profile?.name}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Role:</strong> {profile?.role}</p>

              <button className="cf-btn cf-btn-primary" onClick={() => setEditMode(true)} style={{ marginTop: '20px' }}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="cf-form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Name</label>
                <input 
                  type="text" 
                  className="cf-input" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="cf-form-group" style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>New Password (Leave blank to keep current)</label>
                <input 
                  type="password" 
                  className="cf-input" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>

              <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="cf-btn cf-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="cf-btn" onClick={() => {
                  setEditMode(false);
                  setName(profile?.name || '');
                  setPassword('');
                }} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
