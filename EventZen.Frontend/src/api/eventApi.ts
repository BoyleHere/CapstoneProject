import { apiClient, EVENT_API_URL } from './apiClient';

export interface EventResponse {
  id: number;
  name: string;
  venueId: number;
  capacity: number;
  maxAttendeesPerUser: number;
  description: string;
  eventDate: string; // ISO DateTime
  budget: number;
  costPerTicket: number;
}

export interface EventRequest {
  name: string;
  description: string;
  eventDate: string;
  venueId?: number;
  maxAttendeesPerUser?: number;
  budget?: number;
  costPerTicket?: number;
  // Note: vendorId is not sent in creating an Event
}

export const eventApi = {
  getEvents: async () => {
    const res = await apiClient.get<EventResponse[]>(EVENT_API_URL);
    return res.data;
  },
  getEvent: async (id: number) => {
    const res = await apiClient.get<EventResponse>(`${EVENT_API_URL}/${id}`);
    return res.data;
  },
  createEvent: async (request: EventRequest) => {
    const res = await apiClient.post<EventResponse>(EVENT_API_URL, request);
    return res.data;
  },
  updateEvent: async (id: number, request: EventRequest) => {
    const res = await apiClient.put<EventResponse>(`${EVENT_API_URL}/${id}`, request);
    return res.data;
  },
  assignVendor: async (eventId: number, vendorId: number, vendorCost: number) => {
    const res = await apiClient.post(`${EVENT_API_URL}/${eventId}/vendors/${vendorId}`, {
      agreedPrice: vendorCost,
      notes: ""
    });
    return res.data;
  },
  getEventVendors: async (eventId: number) => {
    const res = await apiClient.get<any[]>(`${EVENT_API_URL}/${eventId}/vendors`);
    return res.data;
  }
};
