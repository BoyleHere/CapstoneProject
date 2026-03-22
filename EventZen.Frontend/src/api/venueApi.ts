import { apiClient, VENUE_API_URL } from './apiClient';

export interface VenueResponse {
  id: number;
  name: string;
  location: string;
  capacity: number;
  price: number;
  description?: string;
}

export interface VenueRequest {
  name: string;
  location: string;
  capacity: number;
  price: number;
  description?: string;
}

export const venueApi = {
  getVenues: async () => {
    const res = await apiClient.get<VenueResponse[]>(VENUE_API_URL);
    return res.data;
  },
  createVenue: async (request: VenueRequest) => {
    const res = await apiClient.post<VenueResponse>(VENUE_API_URL, request);
    return res.data;
  },
  updateVenue: async (id: number, request: VenueRequest) => {
    const res = await apiClient.put<VenueResponse>(`${VENUE_API_URL}/${id}`, request);
    return res.data;
  }
};
