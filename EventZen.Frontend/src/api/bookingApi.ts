import { apiClient, BOOKING_API_URL } from './apiClient';

export interface AttendeeDTO {
  name: string;
  email: string;
  phone: string;
}

export interface CreateBookingRequest {
  eventId: number;
  attendees: AttendeeDTO[];
}

export interface UpdateBookingRequest {
  attendees?: AttendeeDTO[];
  bookingStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export interface BookingSummaryResponse {
  bookingId: number;
  eventId: number;
  attendeeCount: number;
  bookingStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  bookingDate: string;
}

export interface BookingDetailResponse extends BookingSummaryResponse {
  userId: number;
  attendees: AttendeeDTO[];
}

export const bookingApi = {
  createBooking: async (request: CreateBookingRequest) => {
    const res = await apiClient.post(BOOKING_API_URL, request);
    return res.data;
  },
  getMyBookings: async () => {
    const res = await apiClient.get<BookingSummaryResponse[]>(`${BOOKING_API_URL}/my`);
    return res.data;
  },
  getBookingDetails: async (id: number) => {
    const res = await apiClient.get<BookingDetailResponse>(`${BOOKING_API_URL}/${id}`);
    return res.data;
  },
  updateBooking: async (id: number, request: UpdateBookingRequest) => {
    const res = await apiClient.put(`${BOOKING_API_URL}/${id}`, request);
    return res.data;
  },
  // Admin Methods
  getAllBookings: async (page = 0, size = 20) => {
    const res = await apiClient.get(`${BOOKING_API_URL}?page=${page}&size=${size}`);
    return res.data; // Page<BookingSummaryResponse>
  },
  getEventAttendees: async (eventId: number) => {
    const res = await apiClient.get<AttendeeDTO[]>(`${BOOKING_API_URL}/event/${eventId}/attendees`);
    return res.data;
  }
};
