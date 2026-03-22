import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import type { EventResponse } from '../../api/eventApi';
import { venueApi } from '../../api/venueApi';
import type { VenueResponse } from '../../api/venueApi';
import { bookingApi } from '../../api/bookingApi';
import type { AttendeeDTO } from '../../api/bookingApi';

export function AdminEventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [venue, setVenue] = useState<VenueResponse | null>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [attendees, setAttendees] = useState<AttendeeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (eventId: number) => {
    try {
      const ev = await eventApi.getEvent(eventId);
      setEvent(ev);

      // Load related data concurrently
      const [allVenues, evVendors, evAttendees] = await Promise.all([
        venueApi.getVenues(),
        eventApi.getEventVendors(eventId).catch(() => []),
        bookingApi.getEventAttendees(eventId).catch(() => [])
      ]);

      if (ev.venueId) {
        setVenue(allVenues.find(v => v.id === ev.venueId) || null);
      }
      setVendors(evVendors);
      setAttendees(evAttendees);

    } catch (err) {
      setError('Failed to load event details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content-area">Loading event...</div>;
  if (error || !event) return <div className="content-area" style={{ color: 'var(--cf-red)' }}>{error || 'Event not found.'}</div>;

  const venueCost = venue?.price || 0;
  const eventTotalBudget = event.budget || 0;

  return (
    <div className="content-area">
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Admin View: {event.name}</span>
        <button className="cf-btn" onClick={() => navigate('/admin/events')}>&laquo; Back to Manage</button>
      </h3>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="panel" style={{ flex: 1, minWidth: '300px' }}>
          <div className="panel-header">Event Overview</div>
          <div className="panel-body" style={{ fontSize: '13px', lineHeight: '1.8' }}>
            <p><strong>Name:</strong> {event.name}</p>
            <p><strong>Date & Time:</strong> {new Date(event.eventDate).toLocaleString()}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Capacity Limits:</strong> {event.capacity} total, {event.maxAttendeesPerUser === 0 ? 'Unlimited' : event.maxAttendeesPerUser} per user</p>
            <p><strong>Ticket Price:</strong> ₹{event.costPerTicket?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="panel" style={{ flex: 1, minWidth: '300px' }}>
          <div className="panel-header">Budget & Venue</div>
          <div className="panel-body" style={{ fontSize: '13px', lineHeight: '1.8' }}>
            <p><strong>Total Allocated Budget:</strong> ₹{eventTotalBudget.toFixed(2)}</p>
            <p><strong>Assigned Venue:</strong> {venue ? `${venue.name} (Cap: ${venue.capacity})` : 'TBD'}</p>
            <p><strong>Venue Base Price:</strong> -₹{venueCost.toFixed(2)}</p>

          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="panel" style={{ flex: 1 }}>
          <div className="panel-header">Assigned Vendors ({vendors.length})</div>
          <div className="panel-body">
            {vendors.length === 0 ? <p>No vendors assigned.</p> : (
              <table className="cf-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Vendor Name</th>
                    <th style={{ textAlign: 'left' }}>Service Type</th>
                    <th style={{ textAlign: 'right' }}>Assigned Date</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v, i) => (
                    <tr key={i}>
                      <td><strong>{v.vendorName}</strong></td>
                      <td><span className="badge badge-approved" style={{ backgroundColor: '#555' }}>{v.serviceType}</span></td>
                      <td style={{ textAlign: 'right' }}>{new Date(v.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">Registered Attendees ({attendees.length})</div>
        <div className="panel-body">
          {attendees.length === 0 ? <p>No attendees have registered yet.</p> : (
            <table className="cf-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', width: '5%' }}>#</th>
                  <th style={{ textAlign: 'left', width: '30%' }}>Name</th>
                  <th style={{ textAlign: 'left', width: '35%' }}>Email</th>
                  <th style={{ textAlign: 'left', width: '30%' }}>Phone</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
