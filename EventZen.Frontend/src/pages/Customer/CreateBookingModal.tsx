import { useState } from 'react';
import { bookingApi } from '../../api/bookingApi';
import type { EventResponse } from '../../api/eventApi';

interface ModalProps {
  event: EventResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBookingModal({ event, onClose, onSuccess }: ModalProps) {
  const [attendees, setAttendees] = useState([{ name: '', email: '', phone: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const maxAttendees = (!event.maxAttendeesPerUser || event.maxAttendeesPerUser === 0) ? Infinity : event.maxAttendeesPerUser;

  const handleAddAttendee = () => {
    if (attendees.length < maxAttendees) {
      setAttendees([...attendees, { name: '', email: '', phone: '' }]);
    }
  };

  const handleRemoveAttendee = (index: number) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value };
    setAttendees(newAttendees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await bookingApi.createBooking({
        eventId: event.id,
        attendees
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit booking. Ensure capacity is open.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="panel" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Register for: {event.name}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
        </div>
        <div className="panel-body">
          {error && <div style={{ color: 'white', backgroundColor: 'var(--cf-red)', padding: '8px', marginBottom: '10px', fontSize: '13px', borderRadius: '3px' }}>{error}</div>}
          
          <div style={{ marginBottom: '15px', fontSize: '12px', padding: '10px', backgroundColor: '#F8F8F8', border: '1px solid #ddd' }}>
            <strong>Event Date:</strong> {new Date(event.eventDate).toLocaleString()}<br/>
            <strong>Cost/Ticket:</strong> ₹{event.costPerTicket?.toFixed(2) || '0.00'}<br/>
            <strong>Limit:</strong> {maxAttendees === Infinity ? 'None' : `${maxAttendees} per user`}
          </div>

          <form onSubmit={handleSubmit}>
            {attendees.map((att, index) => (
              <div key={index} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong>Attendee {index + 1}</strong>
                  {attendees.length > 1 && (
                    <a href="#" onClick={(e) => { e.preventDefault(); handleRemoveAttendee(index); }} style={{ color: 'var(--cf-red)', fontSize: '12px' }}>[Remove]</a>
                  )}
                </div>
                <div className="cf-form-group">
                  <input type="text" className="cf-input" placeholder="Full Name" value={att.name} onChange={e => handleChange(index, 'name', e.target.value)} required />
                </div>
                <div className="cf-form-group" style={{ display: 'flex', gap: '10px' }}>
                  <input type="email" className="cf-input" placeholder="Email" value={att.email} onChange={e => handleChange(index, 'email', e.target.value)} required />
                  <input type="text" className="cf-input" placeholder="Phone" value={att.phone} onChange={e => handleChange(index, 'phone', e.target.value)} required />
                </div>
              </div>
            ))}

            {attendees.length < maxAttendees && (
              <button type="button" className="cf-btn" onClick={handleAddAttendee} style={{ marginBottom: '20px', fontSize: '11px' }}>
                + Add Another Attendee
              </button>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="cf-btn" onClick={onClose} disabled={submitting}>Cancel</button>
              <button type="submit" className="cf-btn cf-btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : `Submit Booking for ${attendees.length} (Total: ₹${((event.costPerTicket || 0) * attendees.length).toFixed(2)})`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
