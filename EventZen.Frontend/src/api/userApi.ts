import { apiClient } from './apiClient';

export const USER_API_URL = 'http://localhost:5160/api/users';

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UpdateProfileRequest {
  name?: string;
  password?: string;
}

export const userApi = {
  getProfile: async () => {
    const res = await apiClient.get<UserProfileResponse>(`${USER_API_URL}/profile`);
    return res.data;
  },
  updateProfile: async (request: UpdateProfileRequest) => {
    const res = await apiClient.put<UserProfileResponse>(`${USER_API_URL}/profile`, request);
    return res.data;
  }
};
