import { apiClient } from './apiClient';

export const AUTH_API_URL = 'http://localhost:5130/api/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: async (request: LoginRequest) => {
    // The UserService handles this directly
    const res = await apiClient.post<LoginResponse>(`${AUTH_API_URL}/login`, request);
    return res.data;
  },
  register: async (request: RegisterRequest) => {
    const res = await apiClient.post(`${AUTH_API_URL}/register`, request);
    return res.data;
  }
};
