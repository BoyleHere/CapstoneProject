import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Events } from './pages/Customer/Events';
import { MyBookings } from './pages/Customer/MyBookings';
import { BookingDetails } from './pages/Customer/BookingDetails';
import { Dashboard } from './pages/Admin/Dashboard';
import { ManageEvents } from './pages/Admin/ManageEvents';
import { ManageVenues } from './pages/Admin/ManageVenues';
import { ManageVendors } from './pages/Admin/ManageVendors';
import { AdminEventDetails } from './pages/Admin/AdminEventDetails';
import { Profile } from './pages/Customer/Profile';

const Home = () => (
  <div className="content-area">
    <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Welcome to EventZen</h2>
    <div style={{ marginTop: '15px', lineHeight: '1.6' }}>
      <p style={{ fontStyle: 'italic', marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderLeft: '3px solid var(--cf-blue)' }}>
        In halls where Deloitte's visions take flight,<br />
        EventZen emerges, a beacon of light.<br />
        No more tangled schedules or venues unseen,<br />
        Just seamless creations, perfectly clean.<br />
        From vendors to bookings, we handle the flow,<br />
        Making your corporate events beautifully glow.
      </p>
      <p>
        <strong>Why EventZen?</strong><br />
        EventZen is Deloitte's premier algorithmic scheduling and event management platform. Crafted with precision, it bridges the gap between chaotic planning and effortless execution. Whether you are managing hundreds of attendees, optimizing budget allocations with specialized vendors, or securing world-class venues, EventZen handles the complexity so you don't have to.
      </p>
    </div>
  </div>
);

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'ADMIN' | 'CUSTOMER' }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;
  return <>{children}</>;
}

function AppContent() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="layout-main">
          {/* Main Content Router */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute allowedRole="CUSTOMER"><MyBookings /></ProtectedRoute>
            } />
            <Route path="/my-bookings/:id" element={
              <ProtectedRoute allowedRole="CUSTOMER"><BookingDetails /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="ADMIN"><Dashboard /></ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute allowedRole="ADMIN"><ManageEvents /></ProtectedRoute>
            } />
            <Route path="/admin/events/:id" element={
              <ProtectedRoute allowedRole="ADMIN"><AdminEventDetails /></ProtectedRoute>
            } />
            <Route path="/admin/venues" element={
              <ProtectedRoute allowedRole="ADMIN"><ManageVenues /></ProtectedRoute>
            } />
            <Route path="/admin/vendors" element={
              <ProtectedRoute allowedRole="ADMIN"><ManageVendors /></ProtectedRoute>
            } />
          </Routes>
          
          {/* Right Sidebar */}
          <div className="sidebar">
             <div className="panel">
                <div className="panel-header">System Info</div>
                <div className="panel-body">
                   <p>Booking Service: running</p>
                   <p>Event Service: running</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
