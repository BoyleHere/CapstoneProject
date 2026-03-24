import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import type { EventRequest } from '../../api/eventApi';
import { venueApi } from '../../api/venueApi';
import type { VenueResponse } from '../../api/venueApi';
import { vendorApi } from '../../api/vendorApi';
import type { VendorResponse } from '../../api/vendorApi';
import type { EventResponse } from '../../api/eventApi';

export function ManageEvents() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [vendors, setVendors] = useState<VendorResponse[]>([]);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<EventRequest>({
    name: '',
    description: '',
    eventDate: '',
    budget: 0,
    costPerTicket: 0,
    maxAttendeesPerUser: 1
  });

  const [vendorId, setVendorId] = useState<number | ''>('');
  const [selectedVendors, setSelectedVendors] = useState<{ id: number; name: string; cost: number; serviceType: string }[]>([]);

  // Mock costs for demonstration of "net cost" calculation
  const [venueCost, setVenueCost] = useState(0);
  const [vendorCost, setVendorCost] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const [venueData, vendorData, eventData] = await Promise.all([
        venueApi.getVenues(), 
        vendorApi.getVendors(),
        eventApi.getEvents()
      ]);
      setVenues(venueData || []);
      setVendors(vendorData || []);
      
      const parsedEvents = Array.isArray(eventData) ? eventData : (eventData as any).content || [];
      setEvents(parsedEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Clean up empty associations if unselected
      const payload = { ...formData };
      if (!payload.venueId) throw new Error("Venue ID is required by the backend!");

      let eventIdObj = editingEventId;

      if (editingEventId) {
        await eventApi.updateEvent(editingEventId, payload);
        alert('Event updated successfully!');
      } else {
        const createdEvent = await eventApi.createEvent(payload);
        eventIdObj = createdEvent.id;
        
        // Assign multiple vendors in secondary step
        if (eventIdObj && selectedVendors.length > 0) {
          for (const sv of selectedVendors) {
            await eventApi.assignVendor(eventIdObj, sv.id, sv.cost);
          }
        }
        alert('Event created and relations assigned successfully!');
      }

      // Reset form
      setEditingEventId(null);
      setFormData({
        name: '', description: '', eventDate: '',
        budget: 0, costPerTicket: 0, maxAttendeesPerUser: 1, venueId: undefined
      });
      setVendorId('');
      setSelectedVendors([]);
      setVenueCost(0);
      setVendorCost(0);
      fetchResources();
    } catch (err) {
      alert('Failed to save event. Check console for details.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = (ev: EventResponse) => {
    setEditingEventId(ev.id);
    setFormData({
      name: ev.name,
      description: ev.description,
      eventDate: new Date(ev.eventDate).toISOString().slice(0, 16),
      budget: ev.budget,
      costPerTicket: ev.costPerTicket || 0,
      maxAttendeesPerUser: ev.maxAttendeesPerUser,
      venueId: ev.venueId
    });
    setVendorId('');
    setSelectedVendors([]);
    setVendorCost(0);
    // Autofill venue cost for editing if it exists
    if (ev.venueId) {
      const selectedVenue = venues.find(v => v.id === ev.venueId);
      if (selectedVenue) setVenueCost(selectedVenue.price || 0);
    } else {
      setVenueCost(0);
    }
    window.scrollTo(0, 0);
  };

  const cancelEdit = () => {
    setEditingEventId(null);
    setFormData({
      name: '', description: '', eventDate: '',
      budget: 0, costPerTicket: 0, maxAttendeesPerUser: 1, venueId: undefined
    });
    setVendorId('');
    setSelectedVendors([]);
    setVenueCost(0);
    setVendorCost(0);
  };

  const totalVendorCost = selectedVendors.reduce((sum, v) => sum + v.cost, 0);
  const totalCost = venueCost + totalVendorCost;
  const netRemaining = (formData.budget || 0) - totalCost;

  if (loading) return <div className="content-area">Loading resources...</div>;

  return (
    <div className="content-area">
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>
        Manage Events
      </h3>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 2 }}>
          <form onSubmit={handleSubmit} className="panel">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{editingEventId ? 'Update Existing Event' : 'Create New Event'}</span>
              {editingEventId && <button type="button" onClick={cancelEdit} style={{ background: 'none', border: 'none', color: 'var(--link-color)', cursor: 'pointer' }}>Cancel Edit</button>}
            </div>
            <div className="panel-body">
              <div className="cf-form-group">
                <label className="cf-label">Event Name</label>
                <input type="text" name="name" className="cf-input" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="cf-form-group" style={{ flex: 1 }}>
                  <label className="cf-label">Select Venue</label>
                  <select name="venueId" className="cf-select" value={formData.venueId || ''} onChange={(e) => {
                    handleChange(e);
                    const id = parseInt(e.target.value);
                    if (id) {
                      const selectedVenue = venues.find(v => v.id === id);
                      if (selectedVenue) setVenueCost(selectedVenue.price || 0);
                    } else {
                      setVenueCost(0);
                    }
                  }}>
                    <option value="">-- No Venue --</option>
                    {venues.map(v => <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity})</option>)}
                  </select>
                </div>
                <div className="cf-form-group" style={{ flex: 1 }}>
                  <label className="cf-label">Estimated Venue Cost (₹)</label>
                  <input type="number" className="cf-input" value={venueCost} onChange={e => setVenueCost(parseFloat(e.target.value) || 0)} min="0" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="cf-form-group" style={{ flex: 1 }}>
                  <label className="cf-label">Select Vendor (Assigned post-creation)</label>
                  <select name="vendorId" className="cf-select" value={vendorId} onChange={e => {
                    const id = parseInt(e.target.value);
                    setVendorId(id || '');
                    if (id) {
                      const selectedVendor = vendors.find(v => v.id === id);
                      if (selectedVendor) setVendorCost(selectedVendor.price || 0);
                    } else {
                      setVendorCost(0);
                    }
                  }}>
                    <option value="">-- No Vendor --</option>
                    {vendors.filter(v => !selectedVendors.find(sv => sv.id === v.id)).map(v => <option key={v.id} value={v.id}>{v.name} ({v.serviceType})</option>)}
                  </select>
                </div>
                <div className="cf-form-group" style={{ flex: 1 }}>
                  <label className="cf-label">Estimated Vendor Cost (₹)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="number" className="cf-input" value={vendorCost} onChange={e => setVendorCost(parseFloat(e.target.value) || 0)} min="0" />
                    <button type="button" className="cf-btn cf-btn-secondary" onClick={() => {
                      if (vendorId) {
                        const vendor = vendors.find(v => v.id === vendorId);
                        if (vendor) {
                          setSelectedVendors([...selectedVendors, { id: vendor.id, name: vendor.name, cost: vendorCost, serviceType: vendor.serviceType }]);
                          setVendorId('');
                          setVendorCost(0);
                        }
                      }
                    }} disabled={!vendorId}>Add</button>
                  </div>
                </div>
              </div>

              {selectedVendors.length > 0 && (
                <div className="panel" style={{ marginBottom: '15px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                  <strong style={{ fontSize: '13px' }}>Selected Vendors:</strong>
                  <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                    {selectedVendors.map(sv => (
                      <li key={sv.id} style={{ fontSize: '13px', marginBottom: '3px' }}>
                        {sv.name} ({sv.serviceType}) - ₹{sv.cost.toFixed(2)}
                        <a href="#" style={{ color: 'var(--cf-red)', marginLeft: '10px', textDecoration: 'none' }} onClick={(e) => {
                          e.preventDefault();
                          setSelectedVendors(selectedVendors.filter(v => v.id !== sv.id));
                        }}>Remove</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="cf-form-group" style={{ flex: 1 }}>
                  <label className="cf-label">Event Date & Time</label>
                  <input type="datetime-local" name="eventDate" className="cf-input" value={formData.eventDate} onChange={handleChange} required />
                </div>
                <div className="cf-form-group" style={{ flex: 1 }}>
                  <label className="cf-label">Max Attendees/User (0 for unlim)</label>
                  <input type="number" name="maxAttendeesPerUser" className="cf-input" value={formData.maxAttendeesPerUser || 0} onChange={handleChange} min="0" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="cf-form-group" style={{ flex: 1 }}>
                  <label className="cf-label">Total Allocated Budget (₹)</label>
                  <input type="number" name="budget" className="cf-input" value={formData.budget || 0} onChange={handleChange} min="0" />
                </div>
                <div className="cf-form-group" style={{ flex: 1 }}>
                  <label className="cf-label">Ticket Drop Price (₹)</label>
                  <input type="number" name="costPerTicket" className="cf-input" value={formData.costPerTicket || 0} onChange={handleChange} min="0" />
                </div>
              </div>

              <div className="cf-form-group">
                <label className="cf-label">Description</label>
                <textarea name="description" className="cf-input" rows={3} value={formData.description} onChange={handleChange} required></textarea>
              </div>

              <button type="submit" className="cf-btn cf-btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : (editingEventId ? 'Update Event' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>

        {/* Budget Math Panel */}
        <div style={{ flex: 1 }}>
          <div className="panel">
            <div className="panel-header">Budget Calculation</div>
            <div className="panel-body">
              <table className="cf-table" style={{ margin: 0 }}>
                <tbody>
                  <tr>
                    <td><strong>Total Allocated Budget:</strong></td>
                    <td style={{ textAlign: 'right' }}>₹{formData.budget?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td>Venue Estimate:</td>
                    <td style={{ textAlign: 'right', color: 'var(--cf-red)' }}>-₹{venueCost.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Vendor Estimate:</td>
                    <td style={{ textAlign: 'right', color: 'var(--cf-red)' }}>-₹{totalVendorCost.toFixed(2)}</td>
                  </tr>
                  <tr style={{ backgroundColor: '#F0F0F0', fontWeight: 'bold' }}>
                    <td>Net Remaining:</td>
                    <td style={{ textAlign: 'right', color: netRemaining < 0 ? 'var(--cf-red)' : 'var(--success-color)' }}>
                      ₹{netRemaining.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              {netRemaining < 0 && (
                <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--cf-red)', fontWeight: 'bold' }}>
                  Warning: The estimated costs exceed the allocated budget!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">Existing Events</div>
        <div className="panel-body">
          <table className="cf-table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '30%' }}>Event Name</th>
                <th style={{ width: '20%' }}>Date</th>
                <th style={{ width: '15%' }}>Capacity</th>
                <th style={{ width: '15%' }}>Ticket Price</th>
                <th style={{ width: '15%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>No events found.</td></tr>
              ) : (
                events.map((ev, i) => (
                  <tr key={ev.id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 'bold' }}>
                      <span style={{ cursor: 'pointer', color: 'var(--text-primary)' }} title="Click to view details" onClick={() => navigate(`/admin/events/${ev.id}`)}>
                        {ev.name}
                      </span>
                    </td>
                    <td>{new Date(ev.eventDate).toLocaleString()}</td>
                    <td>{ev.capacity}</td>
                    <td>₹{ev.costPerTicket?.toFixed(2) || '0.00'}</td>
                    <td>
                      <button type="button" className="cf-btn cf-btn-primary" onClick={() => handleEditTask(ev)} style={{ fontSize: '13px', padding: '6px 12px', minWidth: '70px' }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
