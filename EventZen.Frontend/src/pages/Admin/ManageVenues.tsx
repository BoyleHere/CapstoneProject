import { useState, useEffect } from 'react';
import { venueApi } from '../../api/venueApi';
import type { VenueRequest, VenueResponse } from '../../api/venueApi';

export function ManageVenues() {
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [formData, setFormData] = useState<VenueRequest>({
    name: '',
    location: '',
    capacity: 0,
    price: 0,
    description: ''
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const data = await venueApi.getVenues();
      setVenues(data || []);
    } catch (err) {
      console.error('Failed to load venues');
    } finally {
      setLoadingVenues(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      if (editId) {
        await venueApi.updateVenue(editId, formData);
        setMessage('Venue updated successfully.');
      } else {
        await venueApi.createVenue(formData);
        setMessage('Venue created successfully.');
      }
      setFormData({ name: '', location: '', capacity: 0, price: 0, description: '' });
      setEditId(null);
      fetchVenues();
    } catch (err) {
      setMessage(`Failed to ${editId ? 'update' : 'create'} venue.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (v: VenueResponse) => {
    setEditId(v.id);
    setFormData({
      name: v.name,
      location: v.location,
      capacity: v.capacity,
      price: v.price || 0,
      description: v.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ name: '', location: '', capacity: 0, price: 0, description: '' });
    setMessage('');
  };

  return (
    <div className="content-area" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="panel">
        <div className="panel-header">{editId ? 'Edit Venue' : 'Add New Venue'}</div>
        <div className="panel-body">
          {message && <div style={{ marginBottom: '15px', color: message.includes('Failed') ? 'var(--cf-red)' : 'var(--success-color)' }}>{message}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="cf-form-group">
              <label className="cf-label">Venue Name</label>
              <input type="text" className="cf-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="cf-form-group">
              <label className="cf-label">Location Address/Link</label>
              <input type="text" className="cf-input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
            </div>
            <div className="cf-form-group">
              <label className="cf-label">Max Capacity</label>
              <input type="number" className="cf-input" value={formData.capacity || 0} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} min="1" required />
            </div>
            <div className="cf-form-group">
              <label className="cf-label">Price</label>
              <input type="number" step="0.01" className="cf-input" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} min="0" required />
            </div>
            <div className="cf-form-group">
              <label className="cf-label">Description</label>
              <textarea className="cf-input" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="cf-btn cf-btn-primary" disabled={submitting}>
                {submitting ? (editId ? 'Updating...' : 'Creating...') : (editId ? 'Update Venue' : 'Create Venue')}
              </button>
              {editId && (
                <button type="button" className="cf-btn cf-btn-secondary" onClick={cancelEdit} disabled={submitting}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">Existing Venues</div>
        <div className="panel-body">
          {loadingVenues ? <div>Loading...</div> : (
            <table className="cf-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>#</th>
                  <th style={{ width: '25%' }}>Name</th>
                  <th style={{ width: '20%' }}>Location</th>
                  <th style={{ width: '15%' }}>Capacity</th>
                  <th style={{ width: '15%' }}>Price</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center' }}>No venues found.</td></tr>
                ) : (
                  venues.map((v, index) => (
                    <tr key={v.id}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: 'bold' }}>{v.name}</td>
                      <td>{v.location}</td>
                      <td>{v.capacity}</td>
                      <td>₹{typeof v.price === 'number' ? v.price.toFixed(2) : parseFloat(v.price || '0').toFixed(2)}</td>
                      <td>
                        <button className="cf-btn cf-btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '14px' }} onClick={() => handleEdit(v)}>Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
