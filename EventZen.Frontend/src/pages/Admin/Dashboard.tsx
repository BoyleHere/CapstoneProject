import { useEffect, useState } from 'react';
import { bookingApi } from '../../api/bookingApi';
import type { BookingSummaryResponse } from '../../api/bookingApi';
import { eventApi } from '../../api/eventApi';
import type { EventResponse } from '../../api/eventApi';

export function Dashboard() {
  const [bookings, setBookings] = useState<BookingSummaryResponse[]>([]);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastPage, setPastPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const [data, eventsData] = await Promise.all([
        bookingApi.getAllBookings(0, 100),
        eventApi.getEvents().catch(() => [])
      ]);
      setBookings((data as any).content || []);
      setEvents(Array.isArray(eventsData) ? eventsData : (eventsData as any).content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    if (window.confirm(`Are you sure you want to mark this booking as ${status}?`)) {
      try {
        await bookingApi.updateBooking(id, { bookingStatus: status });
        alert(`Booking marked as ${status}.`);
        fetchBookings();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to update booking status.');
      }
    }
  };

  const pendingBookings = bookings.filter(b => b.bookingStatus === 'PENDING');
  const pastBookings = bookings
    .filter(b => b.bookingStatus !== 'PENDING')
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  const totalPages = Math.ceil(pastBookings.length / PAGE_SIZE);
  const pagedPastBookings = pastBookings.slice(pastPage * PAGE_SIZE, (pastPage + 1) * PAGE_SIZE);

  return (
    <div className="content-area">
      <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>
        Admin Dashboard - Booking Approvals
      </h3>

      {loading ? <div>Loading...</div> : (
        <>
          <div className="panel" style={{ marginBottom: '20px' }}>
            <div className="panel-header">Pending Requests ({pendingBookings.length})</div>
            <div className="panel-body">
              {pendingBookings.length === 0 ? <p>No pending requests.</p> : (
                <table className="cf-table">
                  <thead>
                    <tr>
                      <th style={{ width: '10%' }}>#</th>
                      <th style={{ width: '20%' }}>Event</th>
                      <th style={{ width: '20%' }}>Attendees</th>
                      <th style={{ width: '25%' }}>Date</th>
                      <th style={{ width: '25%' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookings.map((b, index) => (
                      <tr key={b.bookingId}>
                        <td>{index + 1}</td>
                        <td>{events.find(e => e.id === b.eventId)?.name || `Event ${b.eventId}`}</td>
                        <td>{b.attendeeCount}</td>
                        <td>{new Date(b.bookingDate).toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              className="cf-btn cf-btn-primary" 
                              style={{ fontSize: '11px', padding: '2px 8px' }}
                              onClick={() => handleAction(b.bookingId, 'APPROVED')}
                            >
                              Approve
                            </button>
                            <button 
                              className="cf-btn cf-btn-danger" 
                              style={{ fontSize: '11px', padding: '2px 8px' }}
                              onClick={() => handleAction(b.bookingId, 'REJECTED')}
                            >
                              Deny
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">Processed/Past Bookings ({pastBookings.length})</div>
            <div className="panel-body">
              <table className="cf-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Event</th>
                    <th>Attendees</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedPastBookings.map((b, index) => {
                    let badgeClass = `badge badge-${b.bookingStatus.toLowerCase()}`;
                    if (b.bookingStatus === 'REJECTED' || b.bookingStatus === 'CANCELLED') {
                      badgeClass = 'badge status-red';
                    }
                    return (
                    <tr key={b.bookingId}>
                      <td>{pastPage * PAGE_SIZE + index + 1}</td>
                      <td>{events.find(e => e.id === b.eventId)?.name || `Event ${b.eventId}`}</td>
                      <td>{b.attendeeCount}</td>
                      <td>
                        <span className={badgeClass}>{b.bookingStatus}</span>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '13px' }}>
                  <button className="cf-btn cf-btn-secondary" style={{ padding: '2px 10px', fontSize: '13px' }} onClick={() => setPastPage(p => Math.max(0, p - 1))} disabled={pastPage === 0}>
                    &laquo; Prev
                  </button>
                  <span>Page {pastPage + 1} of {totalPages}</span>
                  <button className="cf-btn cf-btn-secondary" style={{ padding: '2px 10px', fontSize: '13px' }} onClick={() => setPastPage(p => Math.min(totalPages - 1, p + 1))} disabled={pastPage === totalPages - 1}>
                    Next &raquo;
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
