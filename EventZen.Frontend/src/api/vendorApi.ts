import { apiClient, VENDOR_API_URL } from './apiClient';

export interface VendorResponse {
  id: number;
  name: string;
  serviceType: string;
  contactEmail: string;
  phone: string;
  price?: number;
}

export interface VendorRequest {
  name: string;
  serviceType: string;
  contactEmail?: string;
  phone?: string;
  price?: number;
}

export const vendorApi = {
  getVendors: async () => {
    const res = await apiClient.get<VendorResponse[]>(VENDOR_API_URL);
    return res.data;
  },
  createVendor: async (request: VendorRequest) => {
    const res = await apiClient.post<VendorResponse>(VENDOR_API_URL, request);
    return res.data;
  },
  updateVendor: async (id: number, request: VendorRequest) => {
    const res = await apiClient.put<VendorResponse>(`${VENDOR_API_URL}/${id}`, request);
    return res.data;
  }
};
