import { useEffect, useState } from 'react';
import { eventApi } from '../../api/eventApi';
import type { EventResponse } from '../../api/eventApi';
import { useAuth } from '../../context/AuthContext';
import { CreateBookingModal } from './CreateBookingModal';
import { bookingApi } from '../../api/bookingApi';
import type { AttendeeDTO } from '../../api/bookingApi';
import { venueApi } from '../../api/venueApi';
import type { VenueResponse } from '../../api/venueApi';

export function Events() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [bookedEventIds, setBookedEventIds] = useState<number[]>([]);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null);
  const [attendeesList, setAttendeesList] = useState<AttendeeDTO[]>([]);
  const [viewingEventInfo, setViewingEventInfo] = useState<{ id: number; name: string } | null>(null);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [data, venuesData] = await Promise.all([
        eventApi.getEvents(),
        venueApi.getVenues().catch(() => [])
      ]);
      setEvents(Array.isArray(data) ? data : (data as any).content || []);
      setVenues(Array.isArray(venuesData) ? venuesData : (venuesData as any).content || []);

      if (isAuthenticated && role === 'CUSTOMER') {
        try {
          const bookings = await bookingApi.getMyBookings();
          // Filter out CANCELLED and REJECTED so they can re-book if the previous attempt failed/was aborted
          const activeBookings = bookings.filter(b => b.bookingStatus !== 'CANCELLED' && b.bookingStatus !== 'REJECTED');
          setBookedEventIds(activeBookings.map(b => b.eventId));
        } catch (bookingErr) {
          console.error("Could not fetch user bookings", bookingErr);
        }
      }
    } catch (err: any) {
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(ev => {
    const isPast = new Date(ev.eventDate) < new Date();
    const isBooked = bookedEventIds.includes(ev.id);
    
    if (filterType === 'UPCOMING') return !isPast && !isBooked;
    if (filterType === 'PAST') return isPast;
    if (filterType === 'BOOKED') return isBooked;
    if (filterType === 'BOOKED') return isBooked;
    return true; // 'ALL'
  });

  const handleViewAttendees = async (ev: EventResponse) => {
    setViewingEventInfo({ id: ev.id, name: ev.name });
    setLoadingAttendees(true);
    try {
      const data = await bookingApi.getEventAttendees(ev.id);
      setAttendeesList(data || []);
    } catch (err) {
      console.error('Failed to fetch attendees:', err);
      alert('Failed to load attendees');
    } finally {
      setLoadingAttendees(false);
    }
  };

  return (
    <div className="content-area">
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Upcoming Events</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Filter:</label>
          <select 
            className="cf-input" 
            style={{ width: '130px', padding: '4px 8px', fontSize: '13px' }} 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="PAST">Past Data</option>
            {isAuthenticated && role === 'CUSTOMER' && <option value="BOOKED">My Booked</option>}
            <option value="ALL">All Events</option>
          </select>
        </div>
      </div>

      {error && <div style={{ color: 'var(--cf-red)', marginBottom: '15px' }}>{error}</div>}
      
      {loading ? (
        <div>Loading events...</div>
      ) : (
        <table className="cf-table">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '30%' }}>Name</th>
              <th style={{ width: '20%' }}>Date</th>
              <th style={{ width: '15%' }}>Venue ID</th>
              <th style={{ width: '15%' }}>Price</th>
              <th style={{ width: '15%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No events found.</td>
              </tr>
            ) : (
              filteredEvents.map((ev, index) => (
                <tr key={ev.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div style={{ fontWeight: 'bold', color: 'var(--link-color)' }}>{ev.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Capacity: {ev.capacity} | Max/User: {ev.maxAttendeesPerUser === 0 ? 'Unlimited' : ev.maxAttendeesPerUser}
                    </div>
                  </td>
                  <td>{new Date(ev.eventDate).toLocaleString()}</td>
                  <td>{ev.venueId ? (venues.find(v => v.id === ev.venueId)?.name || `Venue ${ev.venueId}`) : 'TBD'}</td>
                  <td>₹{ev.costPerTicket?.toFixed(2) || '0.00'}</td>
                  <td>
                    {isAuthenticated && role === 'CUSTOMER' ? (
                      bookedEventIds.includes(ev.id) ? (
                        <span className="badge" style={{ backgroundColor: '#666', color: 'white', padding: '4px 8px', fontSize: '10px' }}>
                          ALREADY BOOKED
                        </span>
                      ) : (
                        <button 
                          className="cf-btn cf-btn-primary" 
                          onClick={() => setSelectedEvent(ev)}
                        >
                          Book
                        </button>
                      )
                    ) : (isAuthenticated && role === 'ADMIN') ? (
                      <button 
                        className="cf-btn cf-btn-secondary" 
                        onClick={() => handleViewAttendees(ev)}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        Attendees
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#888' }}>Login to book</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {selectedEvent && (
        <CreateBookingModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          onSuccess={() => {
            setSelectedEvent(null);
            alert('Booking submitted successfully! Check My Bookings.');
          }}
        />
      )}

      {viewingEventInfo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="panel" style={{ width: '90%', maxWidth: '500px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px' }}>
              <span>Attendees: {viewingEventInfo.name}</span>
              <button style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', lineHeight: '1' }} onClick={() => setViewingEventInfo(null)}>×</button>
            </div>
            <div className="panel-body" style={{ maxHeight: '400px', overflowY: 'auto', padding: '15px' }}>
              {loadingAttendees ? <p>Loading attendees...</p> : (
                attendeesList.length === 0 ? <p>No attendees found for this event.</p> : (
                  <table className="cf-table" style={{ width: '100%' }}>
                    <thead><tr><th style={{ textAlign: 'left' }}>Name</th><th style={{ textAlign: 'left' }}>Email</th><th style={{ textAlign: 'left' }}>Phone</th></tr></thead>
                    <tbody>
                      {attendeesList.map((a, idx) => (
                        <tr key={idx}><td>{a.name}</td><td>{a.email}</td><td>{a.phone}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
              <div style={{ marginTop: '15px', textAlign: 'right' }}>
                <button className="cf-btn cf-btn-secondary" onClick={() => setViewingEventInfo(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
