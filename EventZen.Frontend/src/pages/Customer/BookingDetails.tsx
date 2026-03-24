import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import type { BookingDetailResponse, AttendeeDTO } from '../../api/bookingApi';
import { eventApi } from '../../api/eventApi';
import type { EventResponse } from '../../api/eventApi';
import { venueApi } from '../../api/venueApi';
import type { VenueResponse } from '../../api/venueApi';

export function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [venue, setVenue] = useState<VenueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Editable attendees state
  const [attendees, setAttendees] = useState<AttendeeDTO[]>([]);
  const [saving, setSaving] = useState(false);

  const maxPerUser = event?.maxAttendeesPerUser ?? 0; // 0 means unlimited
  const atLimit = maxPerUser > 0 && attendees.length >= maxPerUser;

  useEffect(() => {
    if (id) fetchDetails(parseInt(id));
  }, [id]);

  const fetchDetails = async (bookingId: number) => {
    try {
      const data = await bookingApi.getBookingDetails(bookingId);
      setBooking(data);
      setAttendees(data.attendees);
      
      try {
        const eventData = await eventApi.getEvent(data.eventId);
        setEvent(eventData);
        if (eventData.venueId) {
          const venuesData = await venueApi.getVenues();
          const v = venuesData.find((v: VenueResponse) => v.id === eventData.venueId);
          setVenue(v || null);
        }
      } catch (eventErr) {
        console.error('Could not fetch event details for booking', eventErr);
      }
    } catch (err: any) {
      setError('Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const isPending = booking?.bookingStatus === 'PENDING';

  const handleAddAttendee = () => {
    if (maxPerUser > 0 && attendees.length >= maxPerUser) return; // guard
    setAttendees([...attendees, { name: '', email: '', phone: '' }]);
  };

  const handleRemoveAttendee = (index: number) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value } as AttendeeDTO;
    setAttendees(newAttendees);
  };

  const handleSave = async () => {
    if (!booking) return;
    if (maxPerUser > 0 && attendees.length > maxPerUser) {
      setError(`Cannot exceed max ${maxPerUser} attendee(s) per user for this event.`);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await bookingApi.updateBooking(booking.bookingId, { attendees });
      alert('Booking updated successfully.');
      fetchDetails(booking.bookingId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update booking.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="content-area">Loading...</div>;
  if (error && !booking) return <div className="content-area" style={{ color: 'var(--cf-red)' }}>{error}</div>;
  if (!booking) return <div className="content-area">Booking not found.</div>;

  return (
    <div className="content-area">
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Booking #{booking.bookingId} Details</span>
        <button className="cf-btn" onClick={() => navigate(-1)}>&laquo; Back</button>
      </h3>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="panel" style={{ flex: 1, minWidth: '300px' }}>
          <div className="panel-header">Booking Info</div>
          <div className="panel-body" style={{ fontSize: '13px', lineHeight: '1.8' }}>
            <p><strong>Booking ID:</strong> {booking.bookingId}</p>
            <p><strong>Booked By User ID:</strong> {booking.userId}</p>
            <p><strong>Status:</strong> <span className={`badge badge-${booking.bookingStatus.toLowerCase()}`}>{booking.bookingStatus}</span></p>
            <p><strong>Date Created:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
            <p><strong>Attendees Count:</strong> {booking.attendeeCount}</p>
          </div>
        </div>

        <div className="panel" style={{ flex: 1, minWidth: '300px' }}>
          <div className="panel-header">Event Details</div>
          <div className="panel-body" style={{ fontSize: '13px', lineHeight: '1.8' }}>
            {event ? (
              <>
                <p><strong>Event Name:</strong> {event.name}</p>
                <p><strong>Date & Time:</strong> {new Date(event.eventDate).toLocaleString()}</p>
                <p><strong>Venue:</strong> {venue ? venue.name : (event.venueId ? `Venue ${event.venueId}` : 'TBD')}</p>
                <p><strong>Cost Per Ticket:</strong> ₹{event.costPerTicket?.toFixed(2) || '0.00'}</p>
              </>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Loading event details...</p>
            )}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          Attendees {isPending && <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal', fontStyle: 'italic', marginLeft: '10px' }}>(You may edit attendees since status is PENDING)</span>}
        </div>
        <div className="panel-body">
          {error && <div style={{ color: 'var(--cf-red)', marginBottom: '10px', fontWeight: 'bold' }}>{error}</div>}
          
          <table className="cf-table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '35%' }}>Name</th>
                <th style={{ width: '30%' }}>Email</th>
                <th style={{ width: '20%' }}>Phone</th>
                {isPending && <th style={{ width: '10%' }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {attendees.map((att, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    {isPending ? (
                      <input type="text" className="cf-input" value={att.name} onChange={e => handleChange(idx, 'name', e.target.value)} />
                    ) : (
                      att.name
                    )}
                  </td>
                  <td>
                    {isPending ? (
                      <input type="email" className="cf-input" value={att.email} onChange={e => handleChange(idx, 'email', e.target.value)} />
                    ) : (
                      att.email
                    )}
                  </td>
                  <td>
                    {isPending ? (
                      <input type="text" className="cf-input" value={att.phone} onChange={e => handleChange(idx, 'phone', e.target.value)} />
                    ) : (
                      att.phone
                    )}
                  </td>
                  {isPending && (
                    <td>
                      {attendees.length > 1 && (
                        <a href="#" onClick={(e) => { e.preventDefault(); handleRemoveAttendee(idx); }} style={{ color: 'var(--cf-red)', fontSize: '12px' }}>Remove</a>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {isPending && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                          <button className="cf-btn" onClick={handleAddAttendee} disabled={atLimit}>
                + Add Attendee {atLimit ? `(max ${maxPerUser})` : ''}
              </button>
              <button className="cf-btn cf-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
