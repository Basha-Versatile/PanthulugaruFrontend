import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Customer, GoogleAuthData } from '@/types';

export async function customerEmailSignup(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<ApiResponse<{ token: string; user: Customer }>> {
  try {
    const payload = {
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      password: data.password,
    };
    const response = await apiClient.post(ENDPOINTS.CUSTOMER_SIGNUP, payload);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Signup failed', data: null as unknown as { token: string; user: Customer } }) as any;
  }
}

export async function customerEmailLogin(data: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ token: string; user: Customer }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.CUSTOMER_LOGIN, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Login failed', data: null as unknown as { token: string; user: Customer } }) as any;
  }
}

export async function customerGoogleAuth(data: GoogleAuthData): Promise<ApiResponse<{ token: string; user: Customer }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.CUSTOMER_GOOGLE_AUTH, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Google auth failed', data: null as unknown as { token: string; user: Customer } }) as any;
  }
}

export async function getCustomerMe(): Promise<ApiResponse<Customer>> {
  try {
    const response = await apiClient.get(ENDPOINTS.CUSTOMER_ME);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get profile', data: null as unknown as Customer }) as any;
  }
}

export async function updateCustomerProfile(data: Partial<Customer>): Promise<ApiResponse<Customer>> {
  try {
    const response = await apiClient.put(ENDPOINTS.CUSTOMER_UPDATE_PROFILE, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update profile', data: null as unknown as Customer }) as any;
  }
}

export async function customerLogout(): Promise<ApiResponse<null>> {
  try {
    const response = await apiClient.post(ENDPOINTS.CUSTOMER_LOGOUT);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Logout failed', data: null }) as any;
  }
}

export async function getMyPGs(): Promise<ApiResponse<string[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.CUSTOMER_MY_PGS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get PGs', data: [] as unknown as string[] }) as any;
  }
}
