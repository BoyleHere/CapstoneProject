import axios from 'axios';

// Assuming standard local ports, adjust if necessary
export const EVENT_API_URL = 'http://localhost:8080/events';
export const BOOKING_API_URL = 'http://localhost:8083/bookings';
export const VENUE_API_URL = 'http://localhost:8080/venues';
export const VENDOR_API_URL = 'http://localhost:8080/vendors';

// Create a mock helper to generate JWTs since we don't have a real Auth Server
// In a real app, this comes from login. Our backend expects a valid JWT.
// Note: For now, we will just pass headers manually per request or set a global.
// Actually, the backend requires a signed JWT. If we don't know the secret, 
// we might run into 401 Unauthorized unless we know the secret to sign mock tokens.
// Wait, the backend has a hardcoded secret in application.properties!
// Secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
// We could sign it here, but installing a JWT signer in React is heavy.
// Instead, we will simulate the backend token endpoint if we had one, OR 
// we will just sign it using an npm library like `jose` or heavily mock it.
// Let's create an axios interceptor that attaches the token from localStorage.

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mock_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
