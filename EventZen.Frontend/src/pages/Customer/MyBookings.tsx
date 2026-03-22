import { useEffect, useState } from 'react';
import { bookingApi } from '../../api/bookingApi';
import type { BookingSummaryResponse } from '../../api/bookingApi';
import { eventApi } from '../../api/eventApi';
import type { EventResponse } from '../../api/eventApi';
import { Link } from 'react-router-dom';

export function MyBookings() {
  const [bookings, setBookings] = useState<BookingSummaryResponse[]>([]);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const [bookingsData, eventsData] = await Promise.all([
        bookingApi.getMyBookings(),
        eventApi.getEvents().catch(() => []) // Gracefully handle event fetch failure
      ]);
      setBookings(bookingsData || []);
      setEvents(Array.isArray(eventsData) ? eventsData : (eventsData as any).content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingApi.updateBooking(id, { bookingStatus: 'CANCELLED' });
        fetchBookings();
      } catch (err) {
        alert('Failed to cancel booking.');
      }
    }
  };

  const filteredBookings = bookings.filter(b => filterStatus === 'ALL' || b.bookingStatus === filterStatus);

  return (
    <div className="content-area">
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>My Bookings</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Filter:</label>
          <select 
            className="cf-input" 
            style={{ width: '130px', padding: '4px 8px', fontSize: '13px' }} 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="cf-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>#</th>
              <th style={{ width: '20%' }}>Event</th>
              <th style={{ width: '15%' }}>Attendees</th>
              <th style={{ width: '25%' }}>Booking Date</th>
              <th style={{ width: '15%' }}>Status</th>
              <th style={{ width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>No bookings found.</td></tr>
            ) : (
              filteredBookings.map((b, index) => {
                let badgeClass = `badge badge-${b.bookingStatus.toLowerCase()}`;
                if (b.bookingStatus === 'REJECTED' || b.bookingStatus === 'CANCELLED') {
                  badgeClass = 'badge status-red';
                }
                return (
                <tr key={b.bookingId}>
                  <td>{index + 1}</td>
                  <td>{events.find(e => e.id === b.eventId)?.name || `Event ${b.eventId}`}</td>
                  <td>{b.attendeeCount}</td>
                  <td>{new Date(b.bookingDate).toLocaleString()}</td>
                  <td>
                    <span className={badgeClass}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/my-bookings/${b.bookingId}`} className="cf-btn" style={{ fontSize: '11px', padding: '2px 6px' }}>
                        View/Edit
                      </Link>
                      {b.bookingStatus === 'PENDING' && (
                        <button 
                          onClick={() => handleCancel(b.bookingId)}
                          className="cf-btn cf-btn-danger" 
                          style={{ fontSize: '11px', padding: '2px 6px' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
