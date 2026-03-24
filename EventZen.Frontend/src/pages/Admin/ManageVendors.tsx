import { useState, useEffect } from 'react';
import { vendorApi } from '../../api/vendorApi';
import type { VendorRequest, VendorResponse } from '../../api/vendorApi';

export function ManageVendors() {
  const [vendors, setVendors] = useState<VendorResponse[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [formData, setFormData] = useState<VendorRequest>({
    name: '',
    serviceType: '',
    contactEmail: '',
    phone: '',
    price: 0
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await vendorApi.getVendors();
      setVendors(data || []);
    } catch (err) {
      console.error('Failed to load vendors');
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      if (editId) {
        await vendorApi.updateVendor(editId, formData);
        setMessage('Vendor updated successfully.');
      } else {
        await vendorApi.createVendor(formData);
        setMessage('Vendor created successfully.');
      }
      setFormData({ name: '', serviceType: '', contactEmail: '', phone: '', price: 0 });
      setEditId(null);
      fetchVendors();
    } catch (err) {
      setMessage(`Failed to ${editId ? 'update' : 'create'} vendor.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (v: VendorResponse) => {
    setEditId(v.id);
    setFormData({
      name: v.name,
      serviceType: v.serviceType,
      contactEmail: v.contactEmail || '',
      phone: v.phone || '',
      price: v.price || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ name: '', serviceType: '', contactEmail: '', phone: '', price: 0 });
    setMessage('');
  };

  return (
    <div className="content-area" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="panel">
        <div className="panel-header">{editId ? 'Edit Vendor' : 'Add New Vendor'}</div>
        <div className="panel-body">
          {message && <div style={{ marginBottom: '15px', color: message.includes('Failed') ? 'var(--cf-red)' : 'var(--success-color)' }}>{message}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="cf-form-group">
              <label className="cf-label">Vendor Name</label>
              <input type="text" className="cf-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="cf-form-group">
              <label className="cf-label">Service Type (e.g. Catering, Lighting)</label>
              <input type="text" className="cf-input" value={formData.serviceType} onChange={e => setFormData({ ...formData, serviceType: e.target.value })} required />
            </div>
            <div className="cf-form-group">
              <label className="cf-label">Contact Email</label>
              <input type="email" className="cf-input" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} />
            </div>
            <div className="cf-form-group">
              <label className="cf-label">Phone Number</label>
              <input type="text" className="cf-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="cf-form-group">
              <label className="cf-label">Price</label>
              <input type="number" step="0.01" className="cf-input" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} min="0" required />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="cf-btn cf-btn-primary" disabled={submitting}>
                {submitting ? (editId ? 'Updating...' : 'Creating...') : (editId ? 'Update Vendor' : 'Create Vendor')}
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
        <div className="panel-header">Existing Vendors</div>
        <div className="panel-body">
          {loadingVendors ? <div>Loading...</div> : (
            <table className="cf-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>#</th>
                  <th style={{ width: '25%' }}>Name</th>
                  <th style={{ width: '15%' }}>Service Type</th>
                  <th style={{ width: '15%' }}>Email</th>
                  <th style={{ width: '10%' }}>Phone</th>
                  <th style={{ width: '10%' }}>Price</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center' }}>No vendors found.</td></tr>
                ) : (
                  vendors.map((v, index) => (
                    <tr key={v.id}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: 'bold' }}>{v.name}</td>
                      <td><span className="badge" style={{ backgroundColor: '#8b5cf6', color: 'white', border: '1px solid #7c3aed' }}>{v.serviceType}</span></td>
                      <td>{v.contactEmail || '-'}</td>
                      <td>{v.phone || '-'}</td>
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
